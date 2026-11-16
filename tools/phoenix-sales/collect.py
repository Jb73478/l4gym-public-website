"""Read verified Netlify submissions; rehearse the import on a disposable CRM copy."""
import csv
import html
import json
import os
import re

import sys
import tempfile
from collections import Counter
from datetime import date, datetime
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, HTTPRedirectHandler, build_opener
from uuid import uuid4

from openpyxl import load_workbook
from import_leads import FIELDS, HEAD, sync

FORM = "phoenix-strength-enquiry"
MASTER = "Phoenix_Distributor_Pipeline_JB-PHX-1.xlsx"
FIELDS_OUT = ["lead_reference", "created_at", *FIELDS.values()]


class Stop(Exception):
    """Only operator-safe messages belong here."""


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


def request(path, token):
    req = Request("https://api.netlify.com/api/v1/" + path,
                  headers={"Authorization": "Bearer " + token, "Accept": "application/json"})
    try:
        with build_opener(NoRedirect()).open(req, timeout=25) as response:
            body = response.read(8_000_001)
    except HTTPError as e:
        if e.code in (401, 403):
            raise Stop("Credential expired or lacks Forms access.") from None
        raise Stop(f"Netlify HTTP {e.code}; retry later.") from None
    except (URLError, OSError):
        raise Stop("Network unavailable; retry later.") from None
    if len(body) > 8_000_000:
        raise Stop("API response exceeded limit.")
    return json.loads(body)


def ident(x):
    if not isinstance(x, str) or not re.fullmatch(r"[a-zA-Z0-9-]{1,80}", x):
        raise Stop("Invalid API identifier.")
    return x


def pages(get, endpoint):
    seen = set()
    for n in range(1, 1001):
        batch = get(f"{endpoint}?page={n}&per_page=100")
        if not isinstance(batch, list):
            raise Stop("Unexpected API response.")
        if not batch:
            return
        for obj in batch:
            key = ident(obj["id"])
            if key in seen:
                raise Stop("Page changed or repeated. Retry collection.")
            seen.add(key)
            yield obj
        if len(batch) < 100:
            return
    raise Stop("Page limit exceeded.")


def collect(site, get):
    site = ident(site)
    forms = [f for f in get(f"sites/{site}/forms") if f.get("name") == FORM]
    if len(forms) != 1 or forms[0].get("site_id") != site:
        raise Stop("Phoenix form or site ID did not match.")
    rows, refs = [], set()
    for obj in pages(get, "forms/" + ident(forms[0]["id"]) + "/submissions"):
        data = obj["data"]
        if obj.get("spam") or obj.get("state") not in (None, "verified", "ham"):
            raise Stop("Unexpected verification state.")
        row = {k: data.get(k) or "" for k in FIELDS_OUT}
        row["created_at"] = obj["created_at"]
        if not all(isinstance(v, str) for v in row.values()):
            raise Stop("Unrecognised form field type.")
        ref = row["lead_reference"].strip().upper()
        if ref in refs:
            raise Stop("Different submissions share a reference. Compare the verified export.")
        refs.add(ref)
        rows.append(row)
    return rows


def guard(path):
    if path.with_name("~$" + path.name).exists():
        raise Stop("Close Excel and allow OneDrive to sync.")
    if any(p != path for p in path.parent.glob(path.stem + "*.xlsx")):
        raise Stop("Possible OneDrive conflict copy. Reconcile files before continuing.")
    if getattr(path.stat(), "st_file_attributes", 0) & (0x1000 | 0x40000 | 0x400000):
        raise Stop("Workbook is offline or requires hydration.")


def write_csv(path, rows):
    with path.open("x", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, FIELDS_OUT)
        writer.writeheader()
        writer.writerows(rows)


def report(book, today):
    sh = book["Website leads"]
    if list(next(sh.values)) != HEAD:
        raise Stop("Tracker schema has changed.")
    rows = [dict(zip(HEAD, r)) for r in list(sh.values)[1:]]
    emails = Counter(str(r["Email"] or "").strip().casefold() for r in rows)
    cards = []
    esc = lambda x: html.escape(str(x or "Not supplied"))
    for r in rows:
        cl, stage = r["Classification"], r["Stage"]
        if cl == "Test" or stage in ("Won","Lost","Order Confirmed","Order Completed"):
            continue
        flags = []
        email = str(r["Email"] or "").strip().casefold()
        if emails[email] > 1: flags.append("Email also appears on another reference")
        if not re.fullmatch(r"[^\s@]+@[^\s@]+\.[^\s@]+",email) or email.endswith(".invalid"):
            flags.append("Check email")
        if re.search(r"\b(test|testing|synthetic|funktionstest)\b", " ".join(str(r[k] or "") for k in ("Contact","Company","Requirements","Equipment")), re.I):
            flags.append("Possible test")
        due = r["Next follow-up"]
        if isinstance(due, datetime): due = due.date()
        if due and not isinstance(due,date): flags.append("Check follow-up date"); due = None
        action = {"Catalogue Requested":"Follow up on catalogue request","Quotation Sent":"Ask for quotation decision",
                  "Qualified":"Agree next step for qualified opportunity","Quotation Requested":"Prepare quotation"}.get(stage,
                  "Make first contact" if not r["Last contact"] else "Arrange next follow-up")
        review = cl != "Lead" or flags
        if review: action = "Review before contact"
        elif due and due > today: continue
        overdue = bool(due and due < today and not review)
        title = ("Overdue · " if overdue else "") + action
        summary = " · ".join(f"{k}: {esc(r[k])}" for k in ("Company","Country","Equipment","Timeframe"))
        detail = esc(r["Requirements"])
        draft = ""
        if not review:
            prompt = {"Quotation Sent":"Have you had a chance to review the quotation?",
                      "Catalogue Requested":"Which catalogue items would you like more detail on?"}.get(stage,
                      "Could you confirm your project size and the next decision date?")
            draft = f"<details><summary>Email draft — review and send manually</summary><p>Hello {esc(r['Contact']) if r['Contact'] else 'there'},</p><p>I’m following up on your Phoenix Strength enquiry{(' about '+esc(r['Equipment'])) if r['Equipment'] else ''}. {prompt}</p><p>Jamie · jamie@l4gym.com</p></details>"
        card = f"<article><b>{esc(title)}</b> · {esc(r['Reference'])}<p>{summary}</p><p>Project size / requirements (as supplied): {detail}</p><p>Owner: {esc(r['Owner'])} · Due: {esc(due)} · Stage: {esc(stage)}</p>{esc('; '.join(flags)) if flags else ''}{draft}</article>"
        cards.append(((0 if overdue else 1 if review else 2, str(due or ''), str(r['Reference'])),card))
    return ("<!doctype html><meta charset=utf-8><meta name=referrer content=no-referrer><title>Phoenix daily actions</title>"
            "<style>body{font:17px system-ui;max-width:850px;margin:3em auto;color:#183339}article{border-top:1px solid #aaa;padding:1em 0}</style>"
            f"<h1>Phoenix daily actions</h1><p>Snapshot: {today} · {len(cards)} website enquiries requiring attention. Tests excluded.</p>"
            + ("".join(c for _,c in sorted(cards)) or "<p>No website sales actions today.</p>"))


def prepare(master, rows, root):
    guard(master)
    before = master.read_bytes()
    root.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=root) as tmp:
        folder = Path(tmp)
        copy = folder/"rehearsal.xlsx"
        copy.write_bytes(before)
        csvpath = folder/"verified.csv"
        write_csv(csvpath, rows)
        counts = sync(copy, csvpath)
        wb = load_workbook(copy)
        page = report(wb, date.today())
        wb.close()
        guard(master)
        if master.read_bytes() != before: raise Stop("Master changed. Refresh before using results.")
        out = folder/"result"
        out.mkdir()
        (out/"Daily actions.html").write_text(page, encoding="utf-8")
        csvpath.rename(out/"verified.csv")
        dest = root/(datetime.now().strftime("%Y-%m-%d_%H%M%S_")+uuid4().hex[:8])
        out.rename(dest)
    return counts,dest


if __name__ == "__main__":
    root = Path(os.environ["LOCALAPPDATA"])/"Phoenix Sales"
    root.mkdir(exist_ok=True)
    try:
        site = (root/"site.txt").read_text().strip()
        token = sys.stdin.readline().strip()
        if not token: raise Stop("Missing credential. Run setup.")
        rows = collect(site, lambda path: request(path,token))
        counts, dest = prepare(Path(os.environ["OneDrive"])/"buyer contacts"/MASTER, rows, root/"runs")
        message = "Preview ready: %d new, %d existing. Master unchanged." % counts
        print(dest/"Daily actions.html")
    except Exception as e:
        message = str(e) if isinstance(e,Stop) else "Input, lock or filesystem validation failed ("+type(e).__name__+")."
        print(message, file=sys.stderr)
        status = 1
    else:
        print(message)
        status = 0
    with (root/"collection.log").open("a",encoding="utf-8") as log:
        print(datetime.now().isoformat(timespec="seconds"), message, file=log)
    sys.exit(status)

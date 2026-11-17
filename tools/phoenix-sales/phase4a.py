"""Private, read-only Phoenix Phase 4A action queue.

Reads the protected operational CRM and Phase 3 workbook. Creates private local
HTML/JSON snapshots; never sends email, changes workbooks or calls remote APIs.
"""
from __future__ import annotations

import argparse
import html
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from openpyxl import load_workbook


class AgentStop(Exception):
    pass


def sheet_records(wb, sheet_name, required):
    if sheet_name not in wb:
        raise AgentStop(f"Required worksheet is missing: {sheet_name}")
    sh = wb[sheet_name]
    match = None
    for row in sh.iter_rows(min_row=1, max_row=min(sh.max_row, 25), values_only=True):
        columns = [str(cell or '').strip() for cell in row]
        if set(required).issubset(columns):
            match = columns
            break
    if match is None:
        raise AgentStop(f"Worksheet columns do not match expected layout: {sheet_name}")
    header_index = next(i for i, row in enumerate(sh.iter_rows(max_row=min(sh.max_row, 25), values_only=True), 1)
                        if [str(cell or '').strip() for cell in row] == match)
    for row in sh.iter_rows(min_row=header_index + 1, values_only=True):
        item = {key: row[i] if i < len(row) else None for i, key in enumerate(match) if key}
        if any(item.get(key) for key in required):
            yield item


def strval(obj):
    if obj is None:
        return ''
    if isinstance(obj, datetime):
        return obj.date().isoformat()
    return str(obj).strip()


def read_evidence(crm_path, phase3_path):
    for label, path in [('CRM', crm_path), ('Phase 3 working copy', phase3_path)]:
        if not path.is_file():
            raise AgentStop(f"{label} file missing. OneDrive must be synced; no new report created.")
        if path.name.startswith('~$') or path.with_name('~$' + path.name).exists():
            raise AgentStop(f"{label} file is locked by Excel. Close Excel before reading.")

    crm = load_workbook(crm_path, read_only=True, data_only=True)
    phase3 = load_workbook(phase3_path, read_only=True, data_only=True)
    try:
        leads = list(sheet_records(crm, 'Phoenix Leads', ('ID', 'Company', 'Status')))
        website = list(sheet_records(crm, 'Website leads', ('Reference', 'Classification', 'Stage')))
        actions = list(sheet_records(phase3, 'Daily actions', ('Priority', 'Reference', 'Action type', 'Next action')))
        shortlist = list(sheet_records(phase3, 'Top25 verified', ('Rank', 'Company', 'History state', 'Specific next action')))
        if len(leads) != 55:
            raise AgentStop(f"Existing prospect count differs from protected baseline (55); found {len(leads)}. Review manually.")
        excluded = sum(strval(r['Classification']).casefold() == 'test' for r in website)
        if excluded != 8:
            raise AgentStop(f"Protected website test classification differs from baseline (8); found {excluded}. Review manually.")
        lead_rows = [{k: strval(r.get(k)) for k in ('ID','Company','Country / Region','Status','Last Contact','Next Action')}
                     for r in leads if strval(r.get('ID'))]
        permitted = [r for r in website if strval(r.get('Classification')).casefold() == 'lead']
        pending = [r for r in website if strval(r.get('Classification')).casefold() not in ('lead', 'test')]
        return {
            'crm_prospects': len(lead_rows),
            'excluded_website_tests': excluded,
            'genuine_website_leads': len(permitted),
            'unclassified_website_submissions': len(pending),
            'crm': lead_rows,
            'actions': [{k: strval(r.get(k)) for k in ('Priority','Reference','Action type','Evidence / status','Next action','Owner','Approval')} for r in actions],
            'shortlist': [{k: strval(r.get(k)) for k in ('Rank','Company','Market','Verification status','History state','Specific next action','Outreach approval gate')} for r in shortlist][:25],
        }
    finally:
        crm.close()
        phase3.close()


def build_html(data, status, timestamp):
    escape = lambda x: html.escape(strval(x), quote=True)
    def row(values):
        return '<tr>' + ''.join('<td>' + escape(v) + '</td>' for v in values) + '</tr>'
    queue = ''.join(row([x.get('Priority'),x.get('Reference'),x.get('Action type'),x.get('Next action'),x.get('Approval')]) for x in data['actions'])
    short = ''.join(row([x.get('Rank'),x.get('Company'),x.get('Market'),x.get('History state'),x.get('Specific next action')]) for x in data['shortlist'])
    return ("<!doctype html><html lang='en'><meta charset='utf-8'><meta name='referrer' content='no-referrer'>"
            "<title>Phoenix sales daily queue</title><style>body{font:15px system-ui;max-width:1100px;margin:30px auto;padding:0 14px;color:#19323b}"
            "table{border-collapse:collapse;width:100%;margin-bottom:2em}th,td{text-align:left;border-bottom:1px solid #ddd;padding:8px;vertical-align:top}"
            "th{background:#edf1f3}p.note{color:#555}</style><h1>Phoenix sales queue — read-only</h1>"
            f"<p>Generated (UTC): {escape(timestamp)}. Private report. No email sent, no CRM updates.</p>"
            f"<p><b>Netlify:</b> {escape(status)}. This report does not independently read Gmail.</p>"
            f"<p><b>CRM:</b> {data['crm_prospects']} existing prospects; {data['excluded_website_tests']} test submissions excluded; "
            f"{data['genuine_website_leads']} leads classified Lead; {data['unclassified_website_submissions']} awaiting classification.</p>"
            "<p class='note'>Daily actions are a dated Phase 3 snapshot, not live correspondence. Confirm latest customer replies before sending; suppress declines.</p>"
            "<h2>Phase 3 action queue</h2><table><tr><th>Priority</th><th>Reference</th><th>Action</th><th>Next step</th><th>Approval</th></tr>"+queue+
            "</table><h2>Research shortlist (not approved recipients)</h2><table><tr><th>Rank</th><th>Company</th><th>Market</th><th>History</th><th>Next step</th></tr>"+short+"</table></html>")


def publish(data, root, netlify_status, now=None):
    timestamp = now or datetime.now(timezone.utc)
    root.mkdir(parents=True, exist_ok=True)
    dest = root / (timestamp.strftime('%Y-%m-%d_%H%M%S_') + uuid4().hex[:8])
    dest.mkdir(mode=0o700)
    payload = {k: v for k,v in data.items() if k != 'crm'}
    payload.update({'generated_utc': timestamp.isoformat(), 'netlify_status': netlify_status,
                    'mailbox_status': 'Not integrated; manual review required',
                    'crm_modified': False, 'emails_sent': False})
    (dest / 'Daily queue.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2), encoding='utf-8')
    (dest / 'Daily queue.html').write_text(build_html(data, netlify_status, timestamp.isoformat()), encoding='utf-8')
    return dest


def main(args):
    root = Path(args.output)
    logfile = root.parent / 'agent-audit.log'
    result = 'failed'
    try:
        data = read_evidence(Path(args.crm), Path(args.phase3))
        folder = publish(data, root, args.netlify_status)
        result = 'pass'
        print(folder / 'Daily queue.html')
        return 0
    except (OSError, AgentStop, ValueError) as exc:
        print(f"Phoenix sales queue was NOT published: {type(exc).__name__}: {exc}",file=sys.stderr)
        return 1
    finally:
        logfile.parent.mkdir(parents=True, exist_ok=True)
        with logfile.open('a',encoding='utf-8') as f:
            f.write(datetime.now(timezone.utc).isoformat()+' phase4a '+result+'\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Private read-only Phase 4A sales queue')
    parser.add_argument('--crm',required=True)
    parser.add_argument('--phase3',required=True)
    parser.add_argument('--output',required=True)
    parser.add_argument('--netlify-status',default='Not collected this run')
    sys.exit(main(parser.parse_args()))

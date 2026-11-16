"""Import a verified Netlify Forms CSV into an existing private Phoenix pipeline."""
import argparse
import csv
import hashlib
import os
import re
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from openpyxl import load_workbook
from openpyxl.styles import Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

STAGES = ["New Lead", "Catalogue Requested", "Contacted", "Qualified", "Quotation Requested",
          "Quotation Sent", "Negotiation", "Order Confirmed", "Order Completed", "Won", "Lost"]
TESTS = {"L4G-PHX-MWGO43MR-AC0F3295", "L4G-PHX-MWGPCCIR-F3AE6FEB", "L4G-PHX-MWHIJ2PQ-17EE59B5"}
HEAD = ["Reference", "Classification", "Stage", "Company", "Contact", "Email", "Country",
        "Request", "Catalogue", "Equipment", "Received UTC", "Last contact", "Next follow-up",
        "Owner", "Notes", "Currency", "Quotation value", "Confirmed order value", "Commission rate",
        "Expected commission", "Approved commission", "Paid commission", "Next action",
        "Phone", "Requirements", "Timeframe", "Source page", "Language", "Lead source",
        "Attribution", "Sales channel", "Original stage", "Original commission status",
        "Consent", "Product", "SKU", "Introduction status"]
FIELDS = dict(zip([4,5,6,7,8,9,10,24,25,26,27,28,29,30,31,32,33,34,35,36,37],
                  "company customer_name email country request_type catalogue_interest equipment_interest phone_whatsapp facility_requirements purchasing_timeframe source_page language lead_source l4gym_attribution sales_channel opportunity_stage commission_status privacy_consent product_name product_sku introduction_status".split()))

def style(sheet):
    sheet.freeze_panes = "D2" if sheet.title == "Website leads" else "A2"
    for cell in sheet[1]:
        cell.fill = PatternFill("solid", fgColor="153B48")
        cell.font = Font(color="FFFFFF", bold=True)
        sheet.column_dimensions[cell.column_letter].width = max(20, len(str(cell.value))+3)
    sheet.row_dimensions[1].height = 28

def choices(sheet, col, items):
    rule = DataValidation(type="list", formula1='"'+",".join(items)+'"', allow_blank=False,
                          showErrorMessage=True, error="Choose a listed value.")
    sheet.add_data_validation(rule)
    rule.add(f"{col}2:{col}1048576")

def setup(book):
    original = book["Phoenix Leads"]
    if [original.cell(1,c).value for c in (1,3,11,12,13)] != ["ID","Company","Status","Last Contact","Next Action"]:
        raise ValueError("Unrecognised prospect sheet")
    leads = book.create_sheet("Website leads")
    leads.append(HEAD)
    style(leads)
    for col in ["A","F","I","J","O","W","Y","AA","AD"]:
        leads.column_dimensions[col].width = 43
    choices(leads,"B",["Lead","Test","Review"])
    choices(leads,"C",STAGES)
    dashboard = book.create_sheet("Sales dashboard",0)
    dashboard.append(["Website enquiries","Count / value","How to use"])
    def count(column, value):
        return f'=COUNTIFS(\'Website leads\'!B:B,"Lead",\'Website leads\'!{column}:{column},"{value}")'
    for label, formula, note in [
        ("First contact",count("W","First contact"),"Filter Next action on Website leads"),
        ("Catalogue awaiting contact",'=COUNTIFS(\'Website leads\'!B:B,"Lead",\'Website leads\'!C:C,"Catalogue Requested",\'Website leads\'!L:L,"")',"Record the date you make contact"),
        ("Quotation awaiting decision",count("C","Quotation Sent"),"Set the next follow-up date"),
        ("Overdue follow-ups",count("W","Overdue"),"Filter Next action for Overdue"),
        ("Confirmed orders",count("C","Order Confirmed"),"Enter the confirmed value and currency"),
        ("Orders completed",count("C","Order Completed"),"Record payments separately"),
        ("Needs classification",'=COUNTIF(\'Website leads\'!B:B,"Review")',"Review historical or ambiguous enquiries before counting"),
        ("Test enquiries",'=COUNTIF(\'Website leads\'!B:B,"Test")',"Excluded from commercial figures"),
        ("Reporting currency","EUR","Edit to view one currency at a time")]:
        dashboard.append([label,formula,note])
    for label, col in [("Confirmed order value","R"),("Expected commission","T"),("Approved commission","U"),("Commission received","V")]:
        dashboard.append([label,f'=SUMIFS(\'Website leads\'!{col}:{col},\'Website leads\'!B:B,"Lead",\'Website leads\'!P:P,B10)',"In the reporting currency above"])
        dashboard.cell(dashboard.max_row,2).number_format='#,##0.00'
    style(dashboard)
    for col,width in {"A":34,"B":22,"C":64}.items(): dashboard.column_dimensions[col].width=width
    dashboard.sheet_view.showGridLines=False
    book.active=0
    # Keep exact historical statuses. Separate research/hold from active opportunities.
    original.cell(1,15,"Pipeline stage")
    for row in range(2,original.max_row+1):
        status=str(original.cell(row,11).value or "")
        stage="Contacted" if status.startswith("Contacted") else "Lost" if status.startswith("Rejected") else None
        original.cell(row,15,stage)
    from openpyxl.worksheet.table import TableColumn
    for table in original.tables.values():
        if table.ref == f"A1:N{original.max_row}":
            table.ref = f"A1:O{original.max_row}"
            table.tableColumns.append(TableColumn(id=15,name="Pipeline stage"))
            if table.autoFilter: table.autoFilter.ref=table.ref
    original.column_dimensions["O"].width=23
    choices(original,"O",STAGES)
    return leads

def literal(cell, value):
    if value:
        if len(value)>32767: raise ValueError("Input exceeds Excel cell limit")
        cell.value=value
        cell.data_type="s"

def sync(target, export, historical=False):
    if target.with_name("~$"+target.name).exists():
        raise ValueError("Close Excel and wait for OneDrive to finish syncing")
    initial=target.read_bytes()
    from io import BytesIO
    book=load_workbook(BytesIO(initial))
    fresh="Website leads" not in book.sheetnames
    sheet=setup(book) if fresh else book["Website leads"]
    dash=book["Sales dashboard"]
    def ledger(stage):
        return f'=COUNTIFS(\'Website leads\'!B:B,"Lead",\'Website leads\'!C:C,"{stage}")'
    updates={15:("Qualified opportunities","Qualified"),16:("Quotations requested","Quotation Requested"),17:("Quotations sent","Quotation Sent")}
    changed=False
    for row,(label,stage) in updates.items():
        if dash.cell(row,1).value not in (None,label):
            raise ValueError("Dashboard layout changed; review before migration")
        if dash.cell(row,1).value is None:
            if any(c.value is not None for c in dash[row]): raise ValueError("Dashboard row in use")
            dash.cell(row,1,label); dash.cell(row,2,ledger(stage)); changed=True
    if dash["B2"].value==ledger("First contact").replace("!C:C","!W:W"):
        dash["B2"]='=COUNTIFS(\'Website leads\'!B:B,"Lead",\'Website leads\'!L:L,"",\'Website leads\'!C:C,"<>Lost",\'Website leads\'!C:C,"<>Won",\'Website leads\'!C:C,"<>Order Completed",\'Website leads\'!C:C,"<>Order Confirmed")'
        changed=True
    # Financial results only include confirmed/completed orders; never sum currencies.
    for row,col in [(11,"R"),(12,"T"),(13,"U"),(14,"V")]:
        prev=f'=SUMIFS(\'Website leads\'!{col}:{col},\'Website leads\'!B:B,"Lead",\'Website leads\'!P:P,B10)'
        terms=[prev[1:-1]+f',\'Website leads\'!C:C,"{stage}")' for stage in ("Order Confirmed","Order Completed")]
        if dash.cell(row,2).value==prev:
            dash.cell(row,2,"="+"+".join(terms)); changed=True
    if [c.value for c in sheet[1]]!=HEAD: raise ValueError("Unexpected website lead columns")
    known={str(r[0]).upper():r for r in list(sheet.values)[1:] if r[0]}
    if len(known)!=sheet.max_row-1: raise ValueError("Missing or duplicate reference in tracker")
    added=skipped=0
    with export.open(encoding="utf-8-sig",newline="") as handle:
        reader=csv.DictReader(handle,strict=True)
        headers=reader.fieldnames or []
        if len(headers)!=len(set(headers)) or not {"lead_reference","email","request_type","source_page"}<=set(headers):
            raise ValueError("Missing or duplicate CSV headers")
        for line,row in enumerate(reader,2):
            ref=(row.get("lead_reference") or "").strip().upper()
            stamp=row.get("created_at") or row.get("submitted_at")
            if None in row or None in row.values() or not re.fullmatch(r"L4G-PHX-[A-Z0-9]+-[A-Z0-9]+",ref) or not all((stamp,row["email"].strip(),row["request_type"].strip())):
                raise ValueError(f"Invalid required fields in CSV row {line}")
            received=datetime.fromisoformat(stamp.replace("Z","+00:00"))
            if received.tzinfo is None: raise ValueError(f"Missing timezone in CSV row {line}")
            if ref in known:
                if known[ref][5]!=row["email"] or known[ref][7]!=row["request_type"]:
                    raise ValueError(f"Conflicting reference in CSV row {line}")
                skipped+=1
                continue
            classification="Review"
            if ref in TESTS or re.search(r"\b(acceptance test|internal test|funktionstest)\b",row.get("facility_requirements",""),re.I):
                classification="Test"
            kind=row["request_type"]
            stage="Catalogue Requested" if kind=="catalogue_request" else "Quotation Requested" if "quot" in kind else "New Lead"
            n=sheet.max_row+1
            sheet.append([ref,classification,stage])
            for col,key in FIELDS.items(): literal(sheet.cell(n,col),row.get(key))
            sheet.cell(n,11,received.astimezone(timezone.utc).replace(tzinfo=None))
            for col in (12,13): sheet.cell(n,col).number_format="yyyy-mm-dd"
            sheet.cell(n,19).number_format="0.00%"
            sheet.cell(n,20,f'=IF(AND(P{n}<>"",ISNUMBER(R{n}),ISNUMBER(S{n})),ROUND(R{n}*S{n},2),"")')
            sheet.cell(n,23,f'=IF(B{n}<>"Lead",B{n},IF(OR(C{n}="Won",C{n}="Lost",C{n}="Order Completed"),"Closed",IF(AND(ISNUMBER(M{n}),M{n}<TODAY()),"Overdue",IF(L{n}="","First contact",IF(M{n}="","Schedule follow-up","Follow up")))))')
            known[ref]=tuple(c.value for c in sheet[n])
            added+=1
    if added or fresh or changed:
        sheet.auto_filter.ref=sheet.dimensions
        with tempfile.TemporaryDirectory(dir=target.parent) as private:
            out=Path(private)/target.name
            book.save(out)
            checked=load_workbook(out,read_only=True)
            if checked[sheet.title].max_row!=sheet.max_row: raise ValueError("Saved row count mismatch")
            checked.close()
            backups=target.parent/"Phoenix CRM backups"
            backups.mkdir(exist_ok=True)
            backup=backups/(target.stem+"-"+datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")+".xlsx")
            with backup.open("xb") as f:
                f.write(initial); f.flush(); os.fsync(f.fileno())
            if backup.read_bytes()!=initial: raise ValueError("Backup verification failed")
            with backup.open("rb") as f:
                saved=load_workbook(f)
                if "Phoenix Leads" not in saved: raise ValueError("Unreadable prospect backup")
                saved.close()
            if target.read_bytes()!=initial or target.with_name("~$"+target.name).exists():
                raise ValueError("Workbook changed or open; close Excel and retry")
            os.replace(out,target)
    return added,skipped

if __name__=="__main__":
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("tracker",type=Path)
    parser.add_argument("csv",type=Path)
    parser.add_argument("--historical",action="store_true")
    args=parser.parse_args()
    import logging
    logging.basicConfig(filename=str(Path(tempfile.gettempdir())/"phoenix-import.log"),level=logging.INFO,
                        format="%(asctime)s %(message)s")
    # OS releases the file lock even after interruption.
    import msvcrt
    lock=Path(tempfile.gettempdir())/("phoenix-"+hashlib.sha256(str(args.tracker.resolve()).lower().encode()).hexdigest()+".lock")
    try:
        with lock.open("a+b") as guard:
            guard.seek(0)
            msvcrt.locking(guard.fileno(),msvcrt.LK_NBLCK,1)
            result=sync(args.tracker,args.csv,args.historical)
            message="Added %s, skipped existing %s" % result
            print(message)
            logging.info(message)
    except Exception as exc:
        logging.error("Import failed (%s). Original CSV can be retried.",type(exc).__name__)
        raise SystemExit(f"Import failed: {exc}")


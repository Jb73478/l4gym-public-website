import csv
import tempfile
import unittest
from datetime import date
from pathlib import Path

from openpyxl import Workbook, load_workbook
from import_leads import sync


class ImportTest(unittest.TestCase):
    def test_retry_and_manual_edits(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            path, export = root/"tracker.xlsx", root/"test.csv"
            book = Workbook()
            original = book.active
            original.title = "Phoenix Leads"
            original.append(["ID", "Priority", "Company", "Country", "Website", "Contact", "Email",
                             "Phone", "Position", "Why", "Status", "Last Contact", "Next Action"])
            original.append(["ABC", None, "Synthetic", None, None, None, None, None, None, None,
                             "Contacted - synthetic", None, "Call"])
            book.save(path)
            row = dict(lead_reference="L4G-PHX-SYNTHETIC-00000001", request_type="catalogue_request",
                       email="synthetic@example.invalid", source_page="/example", privacy_consent="yes",
                       company="=literal", catalogue_interest="Phoenix-Strength-Catalogue-2026-EU.pdf",
                       created_at="2026-11-15T07:28:12Z",facility_requirements="Internal test")
            def write():
                with export.open("w", newline="", encoding="utf-8") as out:
                    writer = csv.DictWriter(out, row)
                    writer.writeheader()
                    writer.writerow(row)
            write()
            self.assertEqual(sync(path, export), (1,0))
            book=load_workbook(path)
            sheet=book["Website leads"]
            self.assertEqual([sheet[k].value for k in ("B2","C2","I2")],
                             ["Test","Catalogue Requested",row["catalogue_interest"]])
            self.assertEqual(sheet["D2"].data_type,"s")
            sheet["C2"]="Order Confirmed"
            sheet["M2"]=date(2026,12,1)
            sheet["O2"]="Keep these notes"
            sheet["P2"],sheet["R2"],sheet["S2"]="EUR",20000,0.075
            self.assertEqual(sheet["T2"].value,'=IF(AND(P2<>"",ISNUMBER(R2),ISNUMBER(S2)),ROUND(R2*S2,2),"")')
            self.assertEqual(round(sheet["R2"].value*sheet["S2"].value,2),1500)
            self.assertIsNone(sheet["V2"].value)
            book.save(path)
            before=path.read_bytes()
            self.assertEqual(sync(path,export),(0,1))
            self.assertEqual(path.read_bytes(),before)
            row["email"]="different@example.invalid"
            write()
            with self.assertRaisesRegex(ValueError,"Conflicting reference"):
                sync(path,export)
            self.assertEqual(path.read_bytes(),before)
            row["email"]="synthetic@example.invalid"
            write()
            self.assertEqual(sync(path,export),(0,1))

if __name__=="__main__":
    unittest.main()

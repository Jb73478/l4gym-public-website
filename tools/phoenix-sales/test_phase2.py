import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError, URLError
from datetime import date
from openpyxl import Workbook, load_workbook
import collect as c

def item(i):
    return {"id":str(i),"created_at":"2026-01-01T12:00:00Z","data":{
        "lead_reference":f"L4G-PHX-EXAMPLE-{i:08}","email":f"sales{i}@example.org","source_page":"/catalogue",
        "request_type":"catalogue_request","company":"<demo>","equipment_interest":"racks"}}

def api(path):
    if path=="sites/site/forms": return [{"id":"form","site_id":"site","name":c.FORM}]
    if path=="forms/form/submissions?page=1&per_page=100": return [item(i) for i in range(100)]
    if path=="forms/form/submissions?page=2&per_page=100": return [item(101)]
    raise AssertionError(path)

class Phase2(unittest.TestCase):
    def test_pages_and_projection(self):
        rows=c.collect("site",api)
        self.assertEqual(len(rows),101)
        self.assertEqual(rows[-1]["source_page"],"/catalogue")
        self.assertNotIn("ip",rows[0])
    def test_duplicate_collision(self):
        pair=[item(1),item(2)]
        pair[1]["data"]=pair[0]["data"]
        with self.assertRaises(c.Stop):
            c.collect("site",lambda p: api(p) if p.endswith("/forms") else pair)
    def test_network_credentials_redacted(self):
        for error,expected in [(URLError("private payload"),"Network"),(HTTPError("",401,"private payload",{},None),"Credential")]:
            with patch("collect.build_opener") as op:
                op.return_value.open.side_effect=error
                with self.assertRaisesRegex(c.Stop,expected) as caught: c.request("sites/test/forms","sample")
                self.assertNotIn("private payload",str(caught.exception))
    def test_preview_and_conflicts(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); path=root/"master.xlsx"; out=root/"out"
            w=Workbook(); s=w.active;s.title="Phoenix Leads"
            s.append(["ID","Priority","Company","Country","Website","Contact","Email","Phone","Position","Why","Status","Last Contact","Next Action"])
            s.append(["D-1",None,"Example historical"])
            w.save(path); before=path.read_bytes()
            rows=c.collect("site",api)[:1]
            (added,_),dest=c.prepare(path,rows,out)
            self.assertEqual(added,1); self.assertEqual(before,path.read_bytes())
            report=(dest/"Daily actions.html").read_text(encoding="utf8")
            self.assertIn("&lt;demo&gt;",report); self.assertNotIn("Email draft",report)
            self.assertEqual(c.sync(path,dest/"verified.csv"),(1,0))
            bak,=(root/"Phoenix CRM backups").glob("*.xlsx"); self.assertEqual(bak.read_bytes(),before)
            self.assertEqual(load_workbook(bak)["Phoenix Leads"]["C2"].value,"Example historical")
            w=load_workbook(path); s=w["Website leads"]; s["B2"]="Lead"; s["M2"]=date(2000,1,1); s["O2"]="manual"; w.save(path)
            baseline=path.read_bytes()
            counts,dest=c.prepare(path,rows,out); self.assertEqual(counts,(0,1));self.assertEqual(path.read_bytes(),baseline)
            text=(dest/"Daily actions.html").read_text(encoding="utf8")
            self.assertIn("Overdue",text);self.assertIn("Email draft",text)
            for marker in ["~$master.xlsx","master-PC.xlsx"]:
                m=root/marker; m.touch()
                with self.assertRaises(c.Stop): c.prepare(path,rows,out)
                m.unlink()
            original_guard=c.guard
            def changed(p):
                original_guard(p)
                if hook.call_count==2: p.write_bytes(before)
            with patch("collect.guard",side_effect=changed) as hook:
                with self.assertRaisesRegex(c.Stop,"changed"): c.prepare(path,rows,out)
            self.assertEqual(path.read_bytes(),before)
            self.assertEqual(len(list(out.iterdir())),2)

if __name__=="__main__": unittest.main()

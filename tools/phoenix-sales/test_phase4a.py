import tempfile
import unittest
from pathlib import Path
from datetime import datetime, timezone
from openpyxl import Workbook
from phase4a import read_evidence, publish, AgentStop

class Phase4ATests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        root=Path(self.tmp.name)
        self.master=root/'Phoenix_Distributor_Pipeline_JB-PHX-1.xlsx'
        self.phase3=root/'Phoenix_Contacts_Reconciliation_Working_20261117_Phase3.xlsx'
        w=Workbook(); s=w.active; s.title='Phoenix Leads';s.append(['ID','Company','Status','Country / Region','Last Contact','Next Action'])
        for i in range(55):s.append([f'JB-PHX-{i+1:03}','Firm '+str(i),'Contacted','UK',None,'Review'])
        s=w.create_sheet('Website leads');s.append(['Reference','Classification','Stage'])
        for i in range(8):s.append([f'TEST-{i}','Test','Catalogue Requested'])
        w.save(self.master)
        w=Workbook();s=w.active;s.title='Daily actions';s.append(['Priority','Reference','Action type','Next action','Approval'])
        s.append(['P1','OLYMPYA','Quoted — awaiting reply','Check latest thread','User approval'])
        s=w.create_sheet('Top25 verified');s.append(['Rank','Company','History state','Specific next action','Market'])
        s.append([1,'<Phoenix>','New','Research','Germany'])
        w.save(self.phase3)

    def test_exclusions_and_private_publication(self):
        before1,before2=self.master.read_bytes(),self.phase3.read_bytes()
        result=read_evidence(self.master,self.phase3)
        self.assertEqual(result['crm_prospects'],55)
        self.assertEqual(result['excluded_website_tests'],8)
        folder=publish(result,Path(self.tmp.name)/'private', 'Netlify disabled in test',datetime(2026,11,17,tzinfo=timezone.utc))
        self.assertTrue((folder/'Daily queue.json').exists())
        page=(folder/'Daily queue.html').read_text()
        self.assertIn('&lt;Phoenix&gt;',page)
        self.assertIn('OLYMPYA',page)
        self.assertNotIn('<Phoenix>',page)
        self.assertEqual(self.master.read_bytes(),before1)
        self.assertEqual(self.phase3.read_bytes(),before2)

    def test_baseline_guard(self):
        from openpyxl import load_workbook
        w=load_workbook(self.master);w['Website leads']['B2']='Lead';w.save(self.master)
        with self.assertRaisesRegex(AgentStop,'test classification'):
            read_evidence(self.master,self.phase3)

    def test_missing_file_guard(self):
        with self.assertRaisesRegex(AgentStop,'missing'):
            read_evidence(Path(self.tmp.name)/'missing.xlsx',self.phase3)

    def test_lock_guard(self):
        (self.master.parent / ('~$'+self.master.name)).touch()
        with self.assertRaisesRegex(AgentStop,'locked'):
            read_evidence(self.master,self.phase3)

if __name__ == '__main__':unittest.main()

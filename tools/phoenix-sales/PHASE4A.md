# Phoenix Strength Sales Agent — Phase 4A (read-only foundation)

**REVIEW CANDIDATE ONLY. NOT DEPLOYED.** This branch does not enable a scheduler, read Gmail, send messages, edit either workbook, change Netlify, or modify the live L4Gym website. It is not the full autonomous agent.

## What this actually does

- Reuses the existing Phase 2 manually configured Netlify preview collector and existing private Windows Python configuration.
- Reads the authoritative `OneDrive\buyer contacts\Phoenix_Distributor_Pipeline_JB-PHX-1.xlsx` and Phase 3 `Phoenix_Contacts_Reconciliation_Working_20261117_Phase3.xlsx` without writing to them.
- Checks for 55 protected CRM prospect records and eight excluded website tests. Stops rather than silently reinterpreting a changed baseline.
- Creates a timestamped private HTML/JSON sales action **snapshot** under `%LOCALAPPDATA%\Phoenix Sales\phase4\runs`. The Phase 3 daily action sheet may be stale, so the report explicitly requires checking live correspondence before contact.
- Uses a local exclusive run lock and a counts/status-only audit log. A lock on one Windows computer does not protect other OneDrive devices.
- Marks unavailable Netlify collection as unavailable, never as fresh. It does **not** independently fetch Gmail correspondence.

## Operator setup — only after review and explicit approval

1. Keep the four scripts in the existing private Phase 2 support folder on the Windows PC, not in the public website folder: `phase4a.py`, `Run Phoenix agent.ps1`, `Install Phoenix schedule.ps1`, and `test_phase4a.py`. Existing `python-path.txt` and `openpyxl` are required.
2. First execute: `python -m unittest -v test_phase4a`. Four synthetic cases cover read-only output, Test exclusion, changed baseline, missing file and Excel lock.
3. Run: `powershell.exe -NoProfile -File '.\Run Phoenix agent.ps1' -SkipNetlify`. Open the fresh report and confirm CRM and Phase 3 file hashes remain unchanged.
4. Run without `-SkipNetlify`; verify the Netlify API is actually collected successfully and no stale file is mistaken for a fresh result.
5. Execute `powershell.exe -NoProfile -File '.\Install Phoenix schedule.ps1'` to **preview** the schedule only (does not register anything).
6. **Only after separate deployment approval and a live Windows acceptance test**, execute the scheduler installer with `-Activate`. It registers 07:45 and 18:30 tasks under the current Windows user. The computer must be awake, Windows signed in, OneDrive synced. Validate real scheduled executions from Task Scheduler history. Disable with `-Remove`.
7. The Phase 2 private Netlify credential is stored with Windows DPAPI. Never include the token in reports, Git, chat, or scheduling arguments.

## Limits / required next increments

This is **not** autonomous prospect discovery or mail monitoring. Phase 4B–4E must separately add current business verification, Gmail access with explicit service authentication, approval-ready drafts, controlled CRM change proposals and reliable scheduling. No automatic external communication, master CRM edits, or pricing commitment is authorised. OLYMPYA has a follow-up sent on 17 Nov 2026; do not send another without checking for a response. None of the 900 provisional contact groups should be equated with verified buying intent.

## Acceptance evidence and blockers

- Local synthetic test run: four tests pass (2026-11-17).
- **Not yet demonstrated:** execution on the owner's Windows computer; DPAPI authentication from a scheduled run; successful scheduled wake-up; report freshness beyond Phase 3; Gmail integration; live automated prospect research.
- Do not describe this PR as deployed, scheduled, or an operational autonomous agent until those checks actually pass.

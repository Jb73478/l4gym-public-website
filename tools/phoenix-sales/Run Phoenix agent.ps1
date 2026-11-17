param([switch]$SkipNetlify)
# Phase 4A: private read-only local report. No external send or workbook write.
$ErrorActionPreference = 'Stop'
if (-not $env:OneDrive -or -not $env:LOCALAPPDATA) { throw 'OneDrive/LOCALAPPDATA environment missing.' }
$contacts = Join-Path $env:OneDrive 'buyer contacts'
$local = Join-Path $env:LOCALAPPDATA 'Phoenix Sales\phase4'
[void](New-Item -ItemType Directory -Force $local)
$lockPath = Join-Path $local 'agent.lock'
$lock = $null
try {
    try { $lock = [System.IO.File]::Open($lockPath, 'OpenOrCreate', 'ReadWrite', 'None') }
    catch { throw 'Another Phoenix agent run is active; no duplicate job started.' }
    $pyPathFile = Join-Path $contacts 'Phoenix sales import\python-path.txt'
    if (-not (Test-Path $pyPathFile)) { throw 'Python path configuration missing (Phase 2 installation).' }
    $python = (Get-Content $pyPathFile -Raw).Trim()
    if (-not (Test-Path $python)) { throw 'Configured Python executable not found.' }
    $master = Join-Path $contacts 'Phoenix_Distributor_Pipeline_JB-PHX-1.xlsx'
    $research = Join-Path $contacts 'Phoenix_Contacts_Reconciliation_Working_20261117_Phase3.xlsx'
    $status = 'Not collected in this run'
    if (-not $SkipNetlify) {
        $preview = Join-Path $contacts 'Phoenix sales import\Phoenix preview kit\Phoenix preview.ps1'
        if (-not (Test-Path $preview)) { $status = 'UNAVAILABLE: Phase 2 preview launcher missing' }
        else {
            try {
                $output = (& $preview 2>&1 | Out-String).Trim()
                if ($LASTEXITCODE -eq 0) { $status = 'Collected successfully in this run; inspect Phase 2 output separately' }
                else { $status = 'UNAVAILABLE: Phase 2 collection returned nonzero; do not use stale results' }
            } catch { $status = 'UNAVAILABLE: Phase 2 collection failed; do not use stale results' }
        }
    }
    & $python (Join-Path $PSScriptRoot 'phase4a.py') --crm $master --phase3 $research --output (Join-Path $local 'runs') --netlify-status $status
    if ($LASTEXITCODE -ne 0) { throw 'Phase 4A report failed validation; no report published.' }
    Write-Output "Phoenix read-only sales snapshot complete. Netlify: $status"
} catch {
    $line = "$(Get-Date -Format o) failed: $($_.Exception.GetType().Name)" + [Environment]::NewLine
    [System.IO.File]::AppendAllText((Join-Path $local 'scheduler-audit.log'), $line)
    throw
} finally {
    if ($lock) { $lock.Dispose() }
}

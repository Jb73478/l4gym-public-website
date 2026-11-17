param([switch]$Activate,[switch]$Remove)
# Explicitly opt-in to Task Scheduler; no tasks are registered by default.
$ErrorActionPreference = 'Stop'
if ($Activate -and $Remove) { throw 'Choose Activate or Remove, not both.' }
$names = @('PhoenixSales-Morning','PhoenixSales-Evening')
if ($Remove) {
    foreach ($name in $names) { Unregister-ScheduledTask -TaskName $name -Confirm:$false -ErrorAction SilentlyContinue }
    Write-Output 'Phoenix scheduled tasks removed; private reports preserved.'
    exit 0
}
if (-not $Activate) {
    Write-Output 'DRY RUN ONLY. No tasks registered. After explicit deployment approval: run with -Activate.'
    Write-Output 'Proposed: 07:45 and 18:30 daily (Windows local time). User must be signed in; PC must be awake.'
    exit 0
}
$runner = Join-Path $PSScriptRoot 'Run Phoenix agent.ps1'
if (-not (Test-Path $runner)) { throw 'Agent runner missing.' }
$me = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
foreach ($name in $names) {
    if (Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue) {
        throw "$name already exists. Refusing to overwrite an existing scheduled task."
    }
}
$quoted = '"' + $runner.Replace('"','') + '"'
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -NonInteractive -ExecutionPolicy Bypass -File $quoted"
$principal = New-ScheduledTaskPrincipal -UserId $me -LogonType Interactive -RunLevel LeastPrivilege
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 25) -MultipleInstances IgnoreNew
$triggers = @( (New-ScheduledTaskTrigger -Daily -At '07:45'), (New-ScheduledTaskTrigger -Daily -At '18:30') )
foreach ($i in 0..1) {
    Register-ScheduledTask -TaskName $names[$i] -Action $action -Trigger $triggers[$i] -Principal $principal -Settings $settings -Description 'Phoenix read-only sales queue; no email sending or CRM writes.' | Out-Null
}
Write-Output 'Two read-only Phoenix tasks registered for the signed-in Windows user.'

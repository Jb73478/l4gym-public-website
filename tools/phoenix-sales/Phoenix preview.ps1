param([switch]$Setup)
$ErrorActionPreference = "Stop"
$root = Join-Path $env:LOCALAPPDATA "Phoenix Sales"
[void](New-Item -ItemType Directory -Force $root)
$secret = Join-Path $root "netlify.dpapi"
if ($Setup) {
    $site = (Read-Host "Netlify Project ID for l4gym.com (not the site name)").Trim()
    if ($site -notmatch "^[a-zA-Z0-9-]{1,80}$") { throw "Invalid Project ID" }
    $secured = Read-Host "Netlify token (hidden)" -AsSecureString
    if ($secured.Length -eq 0) { throw "Empty token" }
    $secured | ConvertFrom-SecureString | Set-Content -Encoding ascii $secret
    $site | Set-Content -Encoding ascii (Join-Path $root "site.txt")
    Write-Output "Credential saved for this Windows user. Nothing scheduled."
    exit 0
}
$py = (Get-Content -LiteralPath (Join-Path $env:OneDrive "buyer contacts\Phoenix sales import\python-path.txt") -Raw).Trim()
$secured = (Get-Content -LiteralPath $secret -Raw).Trim() | ConvertTo-SecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secured)
try {
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) | & $py (Join-Path $PSScriptRoot "collect.py")
    exit $LASTEXITCODE
} finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }

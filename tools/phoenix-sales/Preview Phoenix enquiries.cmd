@echo off
setlocal
if not exist "%LOCALAPPDATA%\Phoenix Sales\netlify.dpapi" (
  powershell -NoProfile -ExecutionPolicy RemoteSigned -File "%~dp0Phoenix preview.ps1" -Setup
  if errorlevel 1 goto end
)
powershell -NoProfile -ExecutionPolicy RemoteSigned -File "%~dp0Phoenix preview.ps1"
:end
pause

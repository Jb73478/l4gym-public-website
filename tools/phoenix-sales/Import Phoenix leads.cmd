@echo off
setlocal
set "TRACKER=%OneDrive%\buyer contacts\Phoenix_Distributor_Pipeline_JB-PHX-1.xlsx"
if not exist "%TRACKER%" set "TRACKER=%USERPROFILE%\OneDrive\buyer contacts\Phoenix_Distributor_Pipeline_JB-PHX-1.xlsx"
if not defined PHOENIX_PYTHON set /p "PHOENIX_PYTHON="<"%~dp0python-path.txt"
if not exist "%PHOENIX_PYTHON%" (echo Python runtime unavailable. Update python-path.txt before retrying. & pause & exit /b 2)
set "EXPORT=%~1"
if not defined EXPORT for /f "usebackq delims=" %%F in (`powershell -NoProfile -STA -Command "Add-Type -AssemblyName System.Windows.Forms; $d=New-Object System.Windows.Forms.OpenFileDialog; $d.Title='Select verified Phoenix Netlify export'; $d.Filter='CSV exports (*.csv)|*.csv'; if($d.ShowDialog() -eq 'OK'){$d.FileName}"`) do set "EXPORT=%%F"
if not defined EXPORT exit /b 0
"%PHOENIX_PYTHON%" "%~dp0import_leads.py" "%TRACKER%" "%EXPORT%"
set "RESULT=%ERRORLEVEL%"
if not defined PHOENIX_NO_PAUSE pause
exit /b %RESULT%



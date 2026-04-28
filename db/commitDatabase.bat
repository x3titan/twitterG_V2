@echo off
echo Processing...

rem Set file names and paths
set "DIRECTORY=%cd%"
set "TARGETFILE=twitterG.bak"
set "ZIPFILE=twitterG.zip"
set "GIT_PATH=C:\Users\Administrator\AppData\Local\GitHubDesktop\app-3.0.8\resources\app\git\cmd\git.exe"

rem Check if the target file exists
if not exist "%DIRECTORY%\%TARGETFILE%" (
    echo Target file %TARGETFILE% does not exist!
    exit /b 1
)

rem Step 1: Delete previous zip file
if exist "%DIRECTORY%\%ZIPFILE%" del "%DIRECTORY%\%ZIPFILE%"

rem Step 2: Use PowerShell to compress the specified file into a zip file
powershell Compress-Archive -Path "%DIRECTORY%\%TARGETFILE%" -DestinationPath "%DIRECTORY%\%ZIPFILE%"

rem Step 3: Check if the zip file was successfully created
if not exist "%DIRECTORY%\%ZIPFILE%" (
    echo Zip file creation failed!
    exit /b 1
)

rem Step 4: Navigate to the GitHub repository directory (assuming the current directory is already managed by GitHub)
cd /d "%DIRECTORY%"

rem Step 5: Add the zip file to GitHub
"%GIT_PATH%" add "%ZIPFILE%"

rem Step 6: Commit changes
"%GIT_PATH%" commit -m "Add new zip file"

rem Step 7: Push to remote repository
"%GIT_PATH%" push

rem Use PowerShell to output a completion message
powershell -Command "Write-Host 'All steps completed!'"

if /I not "%~1"=="--auto" pause

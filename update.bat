@echo off
echo ========================================
echo RAGE MP Server Update Script
echo ========================================
echo.

if "%1"=="" (
    echo Usage: update.bat "D:\path\to\your\ragemp\server"
    pause
    exit /b 1
)

set SERVER_PATH=%1

echo Rebuilding TypeScript...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Updating server files...
xcopy /E /I /Y "dist" "%SERVER_PATH%\dist"
xcopy /E /I /Y "packages\gamemode" "%SERVER_PATH%\packages\gamemode"

echo.
echo ========================================
echo Update complete!
echo ========================================
echo.
echo Restart your RAGE MP server to apply changes.
echo.
pause

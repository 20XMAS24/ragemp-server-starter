@echo off
echo ========================================
echo RAGE MP Quick Setup
echo ========================================
echo.

echo This script will:
echo 1. Install dependencies
echo 2. Build TypeScript
echo 3. Deploy to your server
echo.

set /p SERVER_PATH="Enter your RAGE MP server path (e.g., D:\newservertest): "

if "%SERVER_PATH%"=="" (
    echo ERROR: Server path cannot be empty!
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo Building project...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Deploying to server...
call deploy.bat "%SERVER_PATH%"

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your server is ready!
echo.
echo Next steps:
echo 1. Go to: %SERVER_PATH%
echo 2. Run: ragemp-server.exe
echo 3. Connect to server and use /help command
echo.
pause

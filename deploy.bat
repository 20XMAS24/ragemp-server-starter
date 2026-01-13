@echo off
echo ========================================
echo RAGE MP Server Deployment Script
echo ========================================
echo.

REM Check if server path is provided
if "%1"=="" (
    echo Usage: deploy.bat "D:\path\to\your\ragemp\server"
    echo Example: deploy.bat "D:\newservertest"
    pause
    exit /b 1
)

set SERVER_PATH=%1
echo Server path: %SERVER_PATH%
echo.

echo [1/5] Building TypeScript...
call npm run build
if errorlevel 1 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo Build complete!
echo.

echo [2/5] Creating directories...
if not exist "%SERVER_PATH%\packages\gamemode" mkdir "%SERVER_PATH%\packages\gamemode"
if not exist "%SERVER_PATH%\dist" mkdir "%SERVER_PATH%\dist"
if not exist "%SERVER_PATH%\database" mkdir "%SERVER_PATH%\database"
echo Directories created!
echo.

echo [3/5] Copying packages...
xcopy /E /I /Y "packages\gamemode" "%SERVER_PATH%\packages\gamemode"
echo Packages copied!
echo.

echo [4/5] Copying compiled code...
xcopy /E /I /Y "dist" "%SERVER_PATH%\dist"
echo Compiled code copied!
echo.

echo [5/5] Copying node_modules...
if not exist "%SERVER_PATH%\node_modules" (
    xcopy /E /I /Y "node_modules" "%SERVER_PATH%\node_modules"
    echo Node modules copied!
) else (
    echo Node modules already exist, skipping...
)
echo.

echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo Your server is ready to start!
echo Run: cd "%SERVER_PATH%" && ragemp-server.exe
echo.
pause

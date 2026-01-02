@echo off
cls
color 0B
title AP Police FIR Management - Starting Server

echo.
echo  ════════════════════════════════════════════════════════════════
echo  ║                                                              ║
echo  ║         AP POLICE FIR MANAGEMENT SYSTEM                      ║
echo  ║         Starting Development Server...                       ║
echo  ║                                                              ║
echo  ════════════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo  [1/4] Stopping existing Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo  [OK] Done
echo.

echo  [2/4] Clearing Next.js cache...
if exist .next (
    rmdir /s /q .next >nul 2>&1
    echo  [OK] Cache cleared
) else (
    echo  [OK] No cache to clear
)
echo.

echo  [3/4] Verifying build...
npm run build >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  [OK] Build successful
) else (
    echo  [ERROR] Build failed - check for errors
    pause
    exit /b 1
)
echo.

echo  [4/4] Starting development server...
echo.
echo  ════════════════════════════════════════════════════════════════
echo  ║                                                              ║
echo  ║  WAIT FOR: "Ready in X.XXs"                                  ║
echo  ║  THEN OPEN: http://localhost:3000                            ║
echo  ║                                                              ║
echo  ║  Press Ctrl+C to stop the server                             ║
echo  ║                                                              ║
echo  ════════════════════════════════════════════════════════════════
echo.

call npm run dev

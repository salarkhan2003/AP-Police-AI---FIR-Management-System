@echo off
cls
color 0B
title AP Police FIR Management System - Development Server

echo.
echo ========================================================
echo   AP POLICE FIR MANAGEMENT SYSTEM
echo   Starting Development Server...
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Clearing cache...
if exist .next (
    rmdir /s /q .next 2>nul
    echo Cache cleared!
) else (
    echo No cache found.
)
echo.

echo [2/2] Starting server...
echo.
echo ========================================================
echo   Server will start on: http://localhost:3000
echo   Press Ctrl+C to stop
echo ========================================================
echo.

npm run dev

pause


@echo off
title Menghentikan QuickVitae Platform
echo ========================================================
echo   MENGHENTIKAN APLIKASI QUICKVITAE
echo ========================================================
echo.

echo Menghentikan Backend API pada port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /F /PID %%a 2>nul
)

echo Menghentikan Frontend Vite pada port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo ========================================================
echo   Backend dan Frontend telah berhasil dihentikan.
echo ========================================================
pause

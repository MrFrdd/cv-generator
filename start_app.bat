@echo off
title Menjalankan QuickVitae Platform
echo ========================================================
echo   MENJALANKAN QUICKVITAE SECARA OTOMATIS
echo ========================================================
echo.

:: 1. Memeriksa / Menjalankan MySQL XAMPP jika belum aktif
echo [1/3] Memeriksa status MySQL Server...
netstat -ano | findstr :3306 > nul
if %errorlevel% neq 0 (
    echo       MySQL belum aktif. Menjalankan MySQL XAMPP...
    start "" /B "C:\xampp\mysql\bin\mysqld.exe" --defaults-file=C:\xampp\mysql\bin\my.ini --standalone
    timeout /t 3 /nobreak > nul
) else (
    echo       MySQL sudah aktif pada port 3306.
)

:: 2. Menjalankan Backend API (Port 5000)
echo.
echo [2/3] Membuka Backend Server (Port 5000)...
start "CV-Generator Backend (Port 5000)" cmd /k "cd /d C:\cv-generator\backend && npm run dev"

:: 3. Menjalankan Frontend React Vite (Port 5173)
echo.
echo [3/3] Membuka Frontend Web App (Port 5173)...
start "CV-Generator Frontend (Port 5173)" cmd /k "cd /d C:\cv-generator\frontend && npm run dev"

echo.
echo ========================================================
echo   SELESAI!
echo   Buka browser Anda dan akses: http://localhost:5173
echo ========================================================
timeout /t 5

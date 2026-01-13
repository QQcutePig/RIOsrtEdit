CD /D %~dp0
dir
pause@echo off
cd /d "%~dp0"
echo ✅ 伺服器啟動中...
echo 🌐 http://127.0.0.1:5173
echo.
start http://127.0.0.1:5173
timeout /t 2
python -m http.server 5173
pause

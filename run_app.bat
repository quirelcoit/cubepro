@echo off
echo Starting Speedcube Pro...
start "" http://localhost:8080/index.html
python -m http.server 8080
pause

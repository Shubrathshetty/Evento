@echo off
echo Opening Public Event Portal...
echo Make sure the backend for any login to work ,please run this command in a new terminal:
cd d:\Evento\backend
.\venv\Scripts\uvicorn app.main:app --reload

start http://localhost:8080
echo.
echo Make sure backend and frontend servers are running!
echo This portal allows users to browse and register for published events.
pause

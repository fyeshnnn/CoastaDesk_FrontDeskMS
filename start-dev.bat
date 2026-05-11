@echo off
echo Starting CoastaDesk Development Environment...
echo.

echo [1/2] Starting Laravel Backend...
start "Laravel Backend" cmd /k "cd backend && php artisan serve"

timeout /t 3 /nobreak > nul

echo [2/2] Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting!
echo    Laravel: http://localhost:8000
echo    React:   http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
@echo off
echo Running SSL Fix script...
python ssl_fix.py

echo.
echo Starting Django development server with SSL...
echo.

:: Determine if we're in project root or backend directory
if exist backend\manage.py (
    cd backend
    python manage.py runsslserver --certificate=certs/localhost.crt --key=certs/localhost.key 0.0.0.0:8443
) else (
    python manage.py runsslserver --certificate=certs/localhost.crt --key=certs/localhost.key 0.0.0.0:8443
)

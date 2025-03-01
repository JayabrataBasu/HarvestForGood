@echo off
echo Running Windows SSL Fix script...

:: Create an OpenSSL config file if it doesn't exist
if not exist openssl.cnf (
    echo Creating OpenSSL config file...
    echo # Minimal OpenSSL configuration file for certificate generation > openssl.cnf
    echo. >> openssl.cnf
    echo [ req ] >> openssl.cnf
    echo default_bits = 4096 >> openssl.cnf
    echo default_md = sha256 >> openssl.cnf
    echo distinguished_name = req_distinguished_name >> openssl.cnf
    echo x509_extensions = v3_ca >> openssl.cnf
    echo prompt = no >> openssl.cnf
    echo. >> openssl.cnf
    echo [ req_distinguished_name ] >> openssl.cnf
    echo CN = localhost >> openssl.cnf
    echo. >> openssl.cnf
    echo [ v3_ca ] >> openssl.cnf
    echo subjectKeyIdentifier = hash >> openssl.cnf
    echo authorityKeyIdentifier = keyid:always,issuer:always >> openssl.cnf
    echo basicConstraints = CA:true >> openssl.cnf
)

python ssl_fix_windows.py

echo.
echo Starting Django development server with SSL...
echo.

:: Create certs directory if it doesn't exist
if not exist backend\certs (
    mkdir backend\certs
)

:: Determine if we're in project root or backend directory
if exist backend\manage.py (
    cd backend
    
    echo Using relative paths for certificates...
    python manage.py runsslserver --certificate=certs\localhost.crt --key=certs\localhost.key 0.0.0.0:8443
) else (
    echo Using relative paths for certificates...
    python manage.py runsslserver --certificate=certs\localhost.crt --key=certs\localhost.key 0.0.0.0:8443
)

import os
import sys
import subprocess
from pathlib import Path
import re

def check_settings_file():
    """Check and update Django settings file"""
    print("Checking Django settings file...")
    
    # Find the settings file
    project_root = Path(os.path.dirname(os.path.abspath(__file__)))
    settings_paths = [
        project_root / 'backend' / 'core' / 'settings.py',
        project_root / 'core' / 'settings.py',
    ]
    
    settings_file = None
    for path in settings_paths:
        if path.exists():
            settings_file = path
            print(f"Found settings file at {path}")
            break
    
    if not settings_file:
        print("Error: Could not find Django settings.py file")
        return False
    
    # Read the settings file
    with open(settings_file, 'r') as f:
        content = f.read()
    
    # Check if the required apps are in INSTALLED_APPS
    modified = False
    
    # Check for 'sslserver'
    if 'sslserver' not in content:
        print("Adding 'sslserver' to INSTALLED_APPS...")
        content = re.sub(
            r'(INSTALLED_APPS\s*=\s*\[[\s\S]*?)(\'django\.contrib\.staticfiles\'.*?,)',
            r'\1\2\n    \'sslserver\',',
            content
        )
        modified = True
    else:
        print("'sslserver' already in INSTALLED_APPS")
    
    # Check for 'django_extensions'
    if 'django_extensions' not in content:
        print("Adding 'django_extensions' to INSTALLED_APPS...")
        content = re.sub(
            r'(INSTALLED_APPS\s*=\s*\[[\s\S]*?)(\'django\.contrib\.staticfiles\'.*?,)',
            r'\1\2\n    \'django_extensions\',',
            content
        )
        modified = True
    else:
        print("'django_extensions' already in INSTALLED_APPS")
    
    # If modified, write the updated content back to the file
    if modified:
        with open(settings_file, 'w') as f:
            f.write(content)
        print("Updated settings.py with required apps")
    
    return True

def create_certificate_directory():
    """Create certificate directory if it doesn't exist"""
    print("Setting up certificate directory...")
    
    project_root = Path(os.path.dirname(os.path.abspath(__file__)))
    
    # Check if we have a backend directory
    if (project_root / 'backend').exists():
        cert_dir = project_root / 'backend' / 'certs'
    else:
        cert_dir = project_root / 'certs'
    
    os.makedirs(cert_dir, exist_ok=True)
    print(f"Certificate directory created at {cert_dir}")
    
    return cert_dir

def generate_ssl_certificates(cert_dir):
    """Generate SSL certificates if they don't exist"""
    cert_file = cert_dir / 'localhost.crt'
    key_file = cert_dir / 'localhost.key'
    
    if cert_file.exists() and key_file.exists():
        print("SSL certificates already exist")
        return True
    
    print("Generating SSL certificates...")
    
    # Create a simple OpenSSL config file
    config_file = cert_dir / 'openssl.cnf'
    with open(config_file, 'w') as f:
        f.write("""
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
        """)
    
    # Generate SSL certificates using OpenSSL
    try:
        subprocess.run([
            'openssl', 'req', '-x509', '-nodes', '-days', '365', '-newkey', 'rsa:2048',
            '-keyout', str(key_file), '-out', str(cert_file), 
            '-config', str(config_file)
        ], check=True)
        print(f"SSL certificates generated at {cert_dir}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"Error generating SSL certificates: {e}")
        print("Do you have OpenSSL installed?")
        return False

def install_dependencies():
    """Install required dependencies"""
    print("Installing required packages...")
    
    packages = [
        'django-sslserver',
        'django-extensions',
        'werkzeug',
        'pyopenssl',
    ]
    
    for package in packages:
        try:
            subprocess.run([sys.executable, '-m', 'pip', 'install', package], check=True)
            print(f"✓ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"✗ Failed to install {package}")
    
    return True

def create_run_script(cert_dir):
    """Create a script to run the SSL server"""
    project_root = Path(os.path.dirname(os.path.abspath(__file__)))
    
    # Check if we have a backend directory
    if (project_root / 'backend').exists():
        script_dir = project_root
        manage_py_path = 'backend/manage.py'
        cert_path = f'backend/certs/localhost.crt'
        key_path = f'backend/certs/localhost.key'
    else:
        script_dir = project_root
        manage_py_path = 'manage.py'
        cert_path = 'certs/localhost.crt'
        key_path = 'certs/localhost.key'
    
    # Create batch file for Windows
    with open(script_dir / 'run_ssl.bat', 'w') as f:
        f.write(f"""@echo off
echo Starting Django development server with SSL...

REM Try django-sslserver first
python {manage_py_path} runsslserver --certificate={cert_path} --key={key_path} 0.0.0.0:8443

REM If django-sslserver fails, try django-extensions
if %ERRORLEVEL% NEQ 0 (
    echo Trying with django-extensions...
    python {manage_py_path} runserver_plus --cert-file={cert_path} --key-file={key_path} 0.0.0.0:8443
)
""")
    
    # Create shell script for Unix
    with open(script_dir / 'run_ssl.sh', 'w') as f:
        f.write(f"""#!/bin/bash
echo "Starting Django development server with SSL..."

# Try django-sslserver first
python {manage_py_path} runsslserver --certificate={cert_path} --key={key_path} 0.0.0.0:8443

# If django-sslserver fails, try django-extensions
if [ $? -ne 0 ]; then
    echo "Trying with django-extensions..."
    python {manage_py_path} runserver_plus --cert-file={cert_path} --key-file={key_path} 0.0.0.0:8443
fi
""")
    
    print(f"Created run scripts at {script_dir}")
    print(f"You can now run the SSL server with:")
    print(f"  run_ssl.bat (on Windows)")
    print(f"  bash run_ssl.sh (on Unix)")

def main():
    """Main function to set up SSL environment"""
    print("==== Django SSL Environment Setup ====\n")
    
    # Install dependencies
    install_dependencies()
    
    # Check and update settings file
    check_settings_file()
    
    # Create certificate directory
    cert_dir = create_certificate_directory()
    
    # Generate SSL certificates
    generate_ssl_certificates(cert_dir)
    
    # Create run script
    create_run_script(cert_dir)
    
    print("\n==== Setup Complete ====")
    print("\nTo run the server with SSL:")
    print("1. Navigate to your project root directory")
    print("2. Run the script: run_ssl.bat (Windows) or bash run_ssl.sh (Unix)")
    print("\nOr run manually with one of these commands:")
    print("python manage.py runsslserver --certificate=certs/localhost.crt --key=certs/localhost.key 0.0.0.0:8443")
    print("python manage.py runserver_plus --cert-file=certs/localhost.crt --key-file=certs/localhost.key 0.0.0.0:8443")

if __name__ == "__main__":
    main()

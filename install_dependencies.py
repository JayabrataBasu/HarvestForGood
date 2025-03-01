import subprocess
import sys
import os

def install_dependencies():
    """Install required dependencies for Django SSL server"""
    print("Installing required dependencies...")
    
    # List of packages to install
    packages = [
        'django-sslserver',
        'django-extensions',
        'werkzeug',
        'pyopenssl',
    ]
    
    for package in packages:
        print(f"Installing {package}...")
        try:
            subprocess.check_call([sys.executable, '-m', 'pip', 'install', package])
            print(f"✓ Successfully installed {package}")
        except subprocess.CalledProcessError:
            print(f"✗ Failed to install {package}")
    
    print("\nAll dependencies installed. Now you can run one of the following commands:")
    print("\n1. Using django-sslserver:")
    print("   python manage.py runsslserver --certificate=certs/localhost.crt --key=certs/localhost.key 0.0.0.0:8443")
    print("\n2. Using django-extensions:")
    print("   python manage.py runserver_plus --cert-file=certs/localhost.crt --key-file=certs/localhost.key 0.0.0.0:8443")

if __name__ == "__main__":
    install_dependencies()

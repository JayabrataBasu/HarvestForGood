"""
Script to install necessary dependencies for Django SSL development.
"""
import subprocess
import sys
import importlib

def install_package(package_name):
    """Install a Python package using pip."""
    print(f"Installing {package_name}...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", package_name])
    print(f"Successfully installed {package_name}")

def main():
    """Main function to install and verify dependencies."""
    print("Checking and installing required packages...")
    
    # Try to uninstall the problematic django-sslserver
    try:
        print("Removing old django-sslserver package...")
        subprocess.check_call([sys.executable, "-m", "pip", "uninstall", "-y", "django-sslserver"])
    except:
        print("django-sslserver was not installed or couldn't be removed")
    
    # Install alternative SSL server packages
    packages = [
        "django-extensions",
        "Werkzeug",
        "pyOpenSSL"
    ]
    
    for package in packages:
        try:
            # Try to import the package to see if it's already installed
            importlib.import_module(package.lower().replace("-", "_"))
            print(f"{package} is already installed.")
        except ImportError:
            install_package(package)
    
    print("\nAll dependencies installed!")
    print("\nYou can now run a secure development server with:")
    print("\npython manage.py runserver_plus --cert-file certs/localhost.crt --key-file certs/localhost.key 0.0.0.0:8443")
    
    # Update settings.py
    print("\nMake sure 'django_extensions' is in your INSTALLED_APPS in settings.py")

if __name__ == "__main__":
    main()

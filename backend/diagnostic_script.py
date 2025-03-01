#!/usr/bin/env python
"""
Diagnostic script to check for common HTTPS configuration issues
"""
import os
import sys
import importlib
import subprocess
from pathlib import Path

def check_python_environment():
    """Check Python environment and installed packages"""
    print("=== Python Environment ===")
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")
    
    # Check for required packages
    required_packages = [
        'django',
        'django-sslserver',
        'openssl-python',
    ]
    
    print("\n=== Package Check ===")
    for package in required_packages:
        try:
            pkg = importlib.import_module(package.replace('-', '_'))
            version = getattr(pkg, '__version__', 'unknown version')
            print(f"✅ {package}: {version}")
        except ImportError:
            print(f"❌ {package}: Not installed")
    
    print("\n=== SSL Configuration ===")
    base_dir = Path(__file__).resolve().parent
    cert_path = base_dir / 'certs' / 'localhost.crt'
    key_path = base_dir / 'certs' / 'localhost.key'
    
    print(f"Certificate path: {cert_path}")
    print(f"Certificate exists: {cert_path.exists()}")
    print(f"Key path: {key_path}")
    print(f"Key exists: {key_path.exists()}")
    
    # Check if SSL works with curl
    if cert_path.exists() and key_path.exists():
        print("\n=== SSL Connection Test ===")
        try:
            subprocess.run(
                ["curl", "--insecure", "https://localhost:8443"],
                capture_output=True, 
                text=True,
                timeout=5
            )
            print("Curl test completed - check output above for errors")
        except Exception as e:
            print(f"Failed to test SSL connection: {e}")
    
    print("\n=== Directory Structure Check ===")
    management_path = base_dir / 'apps' / 'management'
    commands_path = management_path / 'commands'
    init_path = management_path / '__init__.py'
    commands_init_path = commands_path / '__init__.py'
    ssl_command_path = commands_path / 'runserver_ssl.py'
    
    print(f"Management path: {management_path}")
    print(f"Management path exists: {management_path.exists()}")
    print(f"Commands path: {commands_path}")
    print(f"Commands path exists: {commands_path.exists()}")
    print(f"Management __init__.py exists: {init_path.exists()}")
    print(f"Commands __init__.py exists: {commands_init_path.exists()}")
    print(f"runserver_ssl.py exists: {ssl_command_path.exists()}")
    
    if not management_path.exists():
        print("\n⚠️ Create the management directory structure:")
        print(f"mkdir -p {management_path}/commands")
        print(f"touch {init_path}")
        print(f"touch {commands_init_path}")
    
    # Check Django settings
    try:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
        import django
        django.setup()
        from django.conf import settings
        
        print("\n=== Django Settings Check ===")
        print(f"'sslserver' in INSTALLED_APPS: {'sslserver' in settings.INSTALLED_APPS}")
        print(f"SSL_CERTIFICATE defined: {hasattr(settings, 'SSL_CERTIFICATE')}")
        print(f"SSL_KEY defined: {hasattr(settings, 'SSL_KEY')}")
        
        if hasattr(settings, 'SSL_CERTIFICATE'):
            print(f"SSL_CERTIFICATE path: {settings.SSL_CERTIFICATE}")
            print(f"SSL_CERTIFICATE file exists: {os.path.exists(settings.SSL_CERTIFICATE)}")
        
        if hasattr(settings, 'SSL_KEY'):
            print(f"SSL_KEY path: {settings.SSL_KEY}")
            print(f"SSL_KEY file exists: {os.path.exists(settings.SSL_KEY)}")
        
    except Exception as e:
        print(f"Failed to check Django settings: {e}")
    
if __name__ == "__main__":
    check_python_environment()

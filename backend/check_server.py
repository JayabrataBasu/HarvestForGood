import sys
import os
import socket
import subprocess
import time
import django

def check_port_availability(port=8000):
    """Check if the port is available or in use."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = False
    try:
        sock.bind(("127.0.0.1", port))
        result = True
    except:
        print(f"Port {port} is already in use.")
    finally:
        sock.close()
    return result

def check_django_settings():
    """Check if Django settings can be loaded."""
    try:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
        django.setup()
        from django.conf import settings
        print(f"Django version: {django.get_version()}")
        print(f"SECRET_KEY defined: {'✓' if getattr(settings, 'SECRET_KEY', None) else '✗'}")
        print(f"DEBUG mode: {'✓' if getattr(settings, 'DEBUG', None) else '✗'}")
        
        # Check database settings
        db_config = getattr(settings, 'DATABASES', {}).get('default', {})
        if db_config:
            print("Database configuration:")
            print(f"  ENGINE: {db_config.get('ENGINE', 'Not set')}")
            print(f"  NAME: {db_config.get('NAME', 'Not set')}")
            print(f"  USER: {db_config.get('USER', 'Not set')}")
            print(f"  HOST: {db_config.get('HOST', 'Not set')}")
            print(f"  PORT: {db_config.get('PORT', 'Not set')}")
        else:
            print("❌ Database configuration not found")
            
        return True
    except Exception as e:
        print(f"❌ Error loading Django settings: {str(e)}")
        return False

def check_installed_apps():
    """Check if all installed apps can be imported."""
    try:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
        django.setup()
        from django.conf import settings
        
        print("\nChecking INSTALLED_APPS:")
        for app in settings.INSTALLED_APPS:
            try:
                __import__(app.split('.')[0])
                print(f"✓ {app}")
            except ImportError as e:
                print(f"❌ {app} - Error: {str(e)}")
        return True
    except Exception as e:
        print(f"Error checking INSTALLED_APPS: {str(e)}")
        return False

def check_database_connection():
    """Check if database connection works."""
    try:
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
        django.setup()
        from django.db import connections
        from django.db.utils import OperationalError
        
        db_conn = connections['default']
        try:
            c = db_conn.cursor()
            print("\n✓ Database connection successful")
            return True
        except OperationalError as e:
            print(f"\n❌ Database Error: {str(e)}")
            return False
    except Exception as e:
        print(f"\n❌ Error checking database: {str(e)}")
        return False

def check_dotenv():
    """Check if .env file exists and has required values."""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        print("\n✓ .env file found")
        required_vars = ['DJANGO_SECRET_KEY', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT']
        with open(env_path, 'r') as f:
            env_content = f.read()
            for var in required_vars:
                if var in env_content:
                    print(f"✓ {var} defined in .env")
                else:
                    print(f"❌ {var} missing from .env")
    else:
        print("\n❌ .env file not found")

def main():
    print("==== Django Server Health Check ====\n")
    
    # Check if port 8000 is available
    port_available = check_port_availability()
    if not port_available:
        print("Warning: Port 8000 is in use. This might be your Django server or another process.")
    else:
        print("Port 8000 is available. Django server is not running.")
    
    # Check if Django settings are valid
    settings_ok = check_django_settings()
    
    # Check installed apps
    apps_ok = check_installed_apps()
    
    # Check database connection
    db_ok = check_database_connection()
    
    # Check .env file
    check_dotenv()
    
    # Summary
    print("\n==== Summary ====")
    print(f"Django Settings: {'✓ OK' if settings_ok else '❌ Failed'}")
    print(f"Installed Apps: {'✓ OK' if apps_ok else '❌ Failed'}")
    print(f"Database Connection: {'✓ OK' if db_ok else '❌ Failed'}")
    print(f"Port 8000: {'✓ Free' if port_available else '❌ In use'}")
    
    if port_available and settings_ok and apps_ok and db_ok:
        print("\n✓ Your Django environment appears to be correctly set up.")
        print("Try running: python manage.py runserver --noreload")
    else:
        print("\n❌ Some checks failed. Fix the issues before starting the server.")

if __name__ == "__main__":
    main()

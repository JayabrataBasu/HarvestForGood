import os
import sys
import subprocess
from pathlib import Path

def run_ssl_server():
    """Run Django development server with SSL support"""
    base_dir = Path(__file__).resolve().parent
    cert_file = os.path.join(base_dir, 'certs', 'localhost.crt')
    key_file = os.path.join(base_dir, 'certs', 'localhost.key')
    
    # Check if certificate files exist
    if not os.path.exists(cert_file) or not os.path.exists(key_file):
        print("Error: SSL certificate files not found!")
        print("Please run generate_ssl_certs.py first to create the certificates.")
        return
    
    # Run Django development server with SSL
    cmd = [
        sys.executable, 'manage.py', 'runsslserver',
        '--certificate', cert_file,
        '--key', key_file,
        '0.0.0.0:8443'  # Listen on all interfaces on port 8443
    ]
    
    print("Starting Django development server with SSL...")
    print("You can access the site at: https://localhost:8443/")
    print("Note: Your browser may show a security warning because the certificate is self-signed.")
    print("This is normal for development environments.")
    
    try:
        subprocess.run(cmd)
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except Exception as e:
        print(f"Error starting server: {e}")
        print("Make sure django-sslserver is installed (pip install django-sslserver)")

if __name__ == "__main__":
    run_ssl_server()

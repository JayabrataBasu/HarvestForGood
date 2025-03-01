import os
import sys
import subprocess
from pathlib import Path

def fix_ssl_certificates():
    """Fix SSL certificate paths and create certificates if needed"""
    print("Checking and fixing SSL certificate configuration...")
    
    # Determine the root directory of the project
    project_root = Path(os.path.abspath(os.path.dirname(__file__)))
    backend_dir = project_root / 'backend'
    
    # Check which directory structure we're working with
    if os.path.exists(backend_dir / 'manage.py'):
        # Structure is project_root/backend/manage.py
        base_dir = backend_dir
        manage_py_path = backend_dir / 'manage.py'
    else:
        # Structure is project_root/manage.py
        base_dir = project_root
        manage_py_path = project_root / 'manage.py'
    
    # Ensure these directories exist
    certs_dir = base_dir / 'certs'
    os.makedirs(certs_dir, exist_ok=True)
    
    # Certificate paths
    cert_file = certs_dir / 'localhost.crt'
    key_file = certs_dir / 'localhost.key'
    
    print(f"Project structure detected:")
    print(f"- Project root: {project_root}")
    print(f"- Base directory: {base_dir}")
    print(f"- Certificate directory: {certs_dir}")
    
    # Generate certificates if they don't exist
    if not os.path.exists(cert_file) or not os.path.exists(key_file):
        print("Certificates not found. Generating new certificates...")
        
        cmd = [
            'openssl', 'req', '-x509', '-newkey', 'rsa:4096', 
            '-keyout', str(key_file), '-out', str(cert_file), 
            '-days', '365', '-nodes', '-subj', '/CN=localhost'
        ]
        
        try:
            subprocess.run(cmd, check=True)
            print(f"SSL certificate and key files created successfully at:")
            print(f"- Certificate: {cert_file}")
            print(f"- Key: {key_file}")
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            print(f"Error: Failed to generate SSL certificates: {e}")
            print("Make sure OpenSSL is installed and available in your PATH.")
            sys.exit(1)
    else:
        print(f"Certificates already exist at:")
        print(f"- Certificate: {cert_file}")
        print(f"- Key: {key_file}")
    
    # Print the correct command to run the SSL server
    print("\nRun the server with this command:")
    print(f"python {manage_py_path.relative_to(os.getcwd())} runsslserver --certificate={cert_file.relative_to(base_dir)} --key={key_file.relative_to(base_dir)} 0.0.0.0:8443")
    print("\nOr use absolute paths:")
    print(f"python {manage_py_path} runsslserver --certificate={cert_file} --key={key_file} 0.0.0.0:8443")
    
    return cert_file, key_file

if __name__ == "__main__":
    fix_ssl_certificates()

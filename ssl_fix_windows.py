import os
import sys
import subprocess
from pathlib import Path

def fix_ssl_certificates_windows():
    """Fix SSL certificate paths and create certificates for Windows environment"""
    print("Checking and fixing SSL certificate configuration for Windows...")
    
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
    
    # Config file path
    config_file = project_root / 'openssl.cnf'
    
    print(f"Project structure detected:")
    print(f"- Project root: {project_root}")
    print(f"- Base directory: {base_dir}")
    print(f"- Certificate directory: {certs_dir}")
    print(f"- OpenSSL config file: {config_file}")
    
    # Generate certificates if they don't exist
    if not os.path.exists(cert_file) or not os.path.exists(key_file):
        print("Certificates not found. Generating new certificates...")
        
        # Windows-specific OpenSSL command with explicit config file
        cmd = [
            'openssl', 'req', 
            '-x509', 
            '-config', str(config_file),
            '-newkey', 'rsa:4096', 
            '-keyout', str(key_file), 
            '-out', str(cert_file), 
            '-days', '365', 
            '-nodes'  # No passphrase
        ]
        
        try:
            subprocess.run(cmd, check=True)
            print(f"SSL certificate and key files created successfully at:")
            print(f"- Certificate: {cert_file}")
            print(f"- Key: {key_file}")
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            print(f"Error: Failed to generate SSL certificates: {e}")
            print("\nDetailed troubleshooting:")
            print("1. Verify OpenSSL is installed and in your PATH:")
            print("   - Download from: https://slproweb.com/products/Win32OpenSSL.html")
            print("   - Install the full version (not the 'Light' version)")
            print("   - Make sure to select the option to add to PATH during installation")
            print("\n2. Check OpenSSL installation:")
            try:
                version = subprocess.run(['openssl', 'version'], capture_output=True, text=True)
                print(f"   - OpenSSL version: {version.stdout.strip()}")
            except FileNotFoundError:
                print("   - OpenSSL command not found in PATH")
            
            print("\n3. Alternative manual command (run from command prompt):")
            print(f'   openssl req -x509 -config "{config_file}" -newkey rsa:4096 -keyout "{key_file}" -out "{cert_file}" -days 365 -nodes')
            
            sys.exit(1)
    else:
        print(f"Certificates already exist at:")
        print(f"- Certificate: {cert_file}")
        print(f"- Key: {key_file}")
    
    # Print the correct command to run the SSL server
    print("\nRun the server with this command:")
    rel_path = os.path.relpath(str(manage_py_path), os.getcwd())
    rel_cert = os.path.relpath(str(cert_file), os.path.dirname(str(manage_py_path)))
    rel_key = os.path.relpath(str(key_file), os.path.dirname(str(manage_py_path)))
    
    print(f"python {rel_path} runsslserver --certificate={rel_cert} --key={rel_key} 0.0.0.0:8443")
    print("\nOr use absolute paths:")
    print(f"python {manage_py_path} runsslserver --certificate=\"{cert_file}\" --key=\"{key_file}\" 0.0.0.0:8443")
    
    return cert_file, key_file

if __name__ == "__main__":
    fix_ssl_certificates_windows()

import os
import subprocess
import sys

def generate_ssl_certificates():
    """Generate self-signed certificates for development"""
    print("Generating self-signed SSL certificates for development...")
    
    # Create directory if it doesn't exist
    cert_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend', 'certs')
    os.makedirs(cert_dir, exist_ok=True)
    
    cert_file = os.path.join(cert_dir, 'localhost.crt')
    key_file = os.path.join(cert_dir, 'localhost.key')
    
    # Check if Windows or Unix-like
    if os.name == 'nt':  # Windows
        # Using OpenSSL for Windows (assuming it's installed)
        cmd = [
            'openssl', 'req', '-x509', '-newkey', 'rsa:4096', 
            '-keyout', key_file, '-out', cert_file, 
            '-days', '365', '-nodes', '-subj', '/CN=localhost'
        ]
        try:
            subprocess.run(cmd, check=True)
            print(f"SSL certificate and key files created successfully at:\n{cert_file}\n{key_file}")
        except subprocess.CalledProcessError:
            print("Error: Failed to generate SSL certificates using OpenSSL.")
            print("Make sure OpenSSL is installed and available in your PATH.")
            print("You can download it from: https://slproweb.com/products/Win32OpenSSL.html")
            sys.exit(1)
        except FileNotFoundError:
            print("Error: OpenSSL not found.")
            print("Please install OpenSSL and ensure it's in your PATH.")
            print("You can download it from: https://slproweb.com/products/Win32OpenSSL.html")
            sys.exit(1)
    else:  # Unix-like systems
        cmd = [
            'openssl', 'req', '-x509', '-newkey', 'rsa:4096', 
            '-keyout', key_file, '-out', cert_file, 
            '-days', '365', '-nodes', '-subj', '/CN=localhost'
        ]
        try:
            subprocess.run(cmd, check=True)
            print(f"SSL certificate and key files created successfully at:\n{cert_file}\n{key_file}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("Error: Failed to generate SSL certificates.")
            print("Make sure OpenSSL is installed.")
            sys.exit(1)

if __name__ == "__main__":
    generate_ssl_certificates()

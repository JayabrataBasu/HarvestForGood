#!/usr/bin/env python
"""
Script to generate self-signed SSL certificates for local development.
"""
import os
import subprocess
from pathlib import Path

def generate_ssl_certs():
    base_dir = Path(__file__).resolve().parent
    certs_dir = base_dir / 'certs'
    
    # Create certs directory if it doesn't exist
    if not certs_dir.exists():
        certs_dir.mkdir()
    
    cert_file = certs_dir / 'localhost.crt'
    key_file = certs_dir / 'localhost.key'
    
    # Check if certificates already exist
    if cert_file.exists() and key_file.exists():
        print("SSL certificates already exist. Delete them if you want to regenerate.")
        return
    
    # Generate a self-signed certificate
    cmd = [
        'openssl', 'req', '-x509', '-nodes',
        '-days', '365',
        '-newkey', 'rsa:2048',
        '-keyout', str(key_file),
        '-out', str(cert_file),
        '-subj', '/CN=localhost'
    ]
    
    try:
        subprocess.run(cmd, check=True)
        print(f"SSL certificates generated successfully at {certs_dir}")
        print("Certificate file:", cert_file)
        print("Key file:", key_file)
    except subprocess.CalledProcessError:
        print("Failed to generate SSL certificates. Make sure OpenSSL is installed.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    generate_ssl_certs()

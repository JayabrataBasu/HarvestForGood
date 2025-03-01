# SSL Certificate Troubleshooting Guide

If you're having issues with SSL certificates in your Django development environment, follow these steps to diagnose and fix the problems.

## Common Errors

### "Can't find key at certs/localhost.key"

This error occurs when Django can't find the SSL certificate files at the specified location. The paths might be incorrect or the certificate files don't exist.

### Solution

1. Run the SSL fix script to create certificates in the correct location:
   ```
   python ssl_fix.py
   ```

2. After running the script, use the exact command that it suggests to start the server.

## Checking Certificate Locations

To manually check if your certificates exist and where they are:

```python
import os
from pathlib import Path

# Check from project root
base_dir = Path(__file__).resolve().parent
cert_file = base_dir / 'certs' / 'localhost.crt'
key_file = base_dir / 'certs' / 'localhost.key'

print(f"Checking for certificate at: {cert_file}")
print(f"Exists: {os.path.exists(cert_file)}")

print(f"Checking for key at: {key_file}")
print(f"Exists: {os.path.exists(key_file)}")

# Check from backend directory
backend_dir = base_dir / 'backend'
backend_cert = backend_dir / 'certs' / 'localhost.crt'
backend_key = backend_dir / 'certs' / 'localhost.key'

print(f"Checking for certificate at: {backend_cert}")
print(f"Exists: {os.path.exists(backend_cert)}")

print(f"Checking for key at: {backend_key}")
print(f"Exists: {os.path.exists(backend_key)}")
```

## Path Configuration

When running the `runsslserver` command, the paths to the certificates are relative to where you're running the command from, not relative to the Django project root.

### Correct ways to run the command:

1. If running from project root and certificates are in `project_root/certs/`:
   ```
   python manage.py runsslserver --certificate=certs/localhost.crt --key=certs/localhost.key 0.0.0.0:8443
   ```

2. If running from project root and certificates are in `project_root/backend/certs/`:
   ```
   python manage.py runsslserver --certificate=backend/certs/localhost.crt --key=backend/certs/localhost.key 0.0.0.0:8443
   ```

3. Using absolute paths (works from any directory):
   ```
   python manage.py runsslserver --certificate=C:/Users/jayab/HarvestForGood/certs/localhost.crt --key=C:/Users/jayab/HarvestForGood/certs/localhost.key 0.0.0.0:8443
   ```

## Quick Fix

For the quickest fix, run the `ssl_run.bat` script which will:
1. Generate the certificates if they don't exist
2. Run the server with the correct paths

```
ssl_run.bat
```

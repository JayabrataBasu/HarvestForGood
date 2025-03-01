import os
import sys
import subprocess
import platform
from pathlib import Path
import importlib.util

def check_environment():
    """Check Python environment and SSL setup"""
    print("="*40)
    print("ENVIRONMENT CHECKS")
    print("="*40)
    print(f"Python version: {platform.python_version()}")
    print(f"Platform: {platform.system()} {platform.release()}")
    print(f"Current directory: {os.getcwd()}")
    
    # Check OpenSSL
    try:
        output = subprocess.run(['openssl', 'version'], capture_output=True, text=True, check=True)
        print(f"OpenSSL version: {output.stdout.strip()}")
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        print(f"OpenSSL error: {e}")
    
    print("\n")

def check_project_structure():
    """Check Django project structure"""
    print("="*40)
    print("PROJECT STRUCTURE CHECKS")
    print("="*40)
    
    # Detect project structure
    project_root = Path(os.getcwd())
    print(f"Current directory: {project_root}")
    
    # Look for manage.py
    manage_py_paths = []
    for path in [project_root, project_root / 'backend']:
        if (path / 'manage.py').exists():
            manage_py_paths.append(path / 'manage.py')
    
    if not manage_py_paths:
        print("ERROR: manage.py not found")
        return False
    
    print(f"Found manage.py at: {', '.join(str(p) for p in manage_py_paths)}")
    
    # Choose the manage.py to work with
    manage_py = manage_py_paths[0]
    manage_dir = manage_py.parent
    
    # Look for certificate directory
    cert_dir = manage_dir / 'certs'
    if cert_dir.exists():
        print(f"Certificate directory found: {cert_dir}")
        
        # Check for certificate files
        cert_file = cert_dir / 'localhost.crt'
        key_file = cert_dir / 'localhost.key'
        
        if cert_file.exists() and key_file.exists():
            print(f"Certificate files found: {cert_file}, {key_file}")
        else:
            missing = []
            if not cert_file.exists():
                missing.append(str(cert_file))
            if not key_file.exists():
                missing.append(str(key_file))
            print(f"WARNING: Missing certificate files: {', '.join(missing)}")
    else:
        print(f"Certificate directory not found: {cert_dir}")
        print("Creating directory...")
        os.makedirs(cert_dir, exist_ok=True)
    
    # Look for Django settings
    settings_paths = []
    for path in [manage_dir / 'core' / 'settings.py', manage_dir / 'settings.py']:
        if path.exists():
            settings_paths.append(path)
    
    if not settings_paths:
        print("WARNING: Django settings.py not found")
    else:
        print(f"Found Django settings at: {', '.join(str(p) for p in settings_paths)}")
    
    print("\n")
    return manage_py, cert_dir

def check_django_config(manage_py):
    """Check Django configuration"""
    print("="*40)
    print("DJANGO CONFIGURATION CHECKS")
    print("="*40)
    
    manage_dir = manage_py.parent
    
    # Try to find django-sslserver in installed apps
    try:
        # Add the parent directory to path so we can import Django settings
        sys.path.insert(0, str(manage_dir))
        
        settings_module = None
        for module_name in ['core.settings', 'settings']:
            try:
                settings_module = importlib.import_module(module_name)
                break
            except ImportError:
                continue
        
        if settings_module:
            installed_apps = getattr(settings_module, 'INSTALLED_APPS', [])
            if 'sslserver' in installed_apps:
                print("✓ 'sslserver' found in INSTALLED_APPS")
            else:
                print("✗ 'sslserver' NOT found in INSTALLED_APPS. Add 'sslserver' to INSTALLED_APPS in settings.py")
            
            # Check SSL paths
            ssl_cert = getattr(settings_module, 'SSL_CERTIFICATE', None)
            ssl_key = getattr(settings_module, 'SSL_KEY', None)
            if ssl_cert:
                print(f"SSL certificate path in settings: {ssl_cert}")
            if ssl_key:
                print(f"SSL key path in settings: {ssl_key}")
        else:
            print("Could not import Django settings")
    except Exception as e:
        print(f"Error checking Django settings: {e}")
    
    # Check django-sslserver installation
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'show', 'django-sslserver'], 
                       capture_output=True, check=True)
        print("✓ django-sslserver is installed")
    except subprocess.CalledProcessError:
        print("✗ django-sslserver is NOT installed. Run 'pip install django-sslserver'")
    
    print("\n")

def generate_certificates(cert_dir):
    """Generate SSL certificates"""
    print("="*40)
    print("CERTIFICATE GENERATION")
    print("="*40)
    
    cert_file = cert_dir / 'localhost.crt'
    key_file = cert_dir / 'localhost.key'
    
    if cert_file.exists() and key_file.exists():
        print("Certificate files already exist. Delete them if you want to regenerate.")
        print(f"- Certificate: {cert_file}")
        print(f"- Key: {key_file}")
        return cert_file, key_file
    
    print("Generating new self-signed certificates...")
    
    # Create a minimal OpenSSL config
    config_content = """
[req]
default_bits = 2048
default_md = sha256
distinguished_name = req_dn
x509_extensions = v3_req
prompt = no

[req_dn]
CN = localhost

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
    """
    
    config_file = cert_dir / 'openssl.cnf'
    with open(config_file, 'w') as f:
        f.write(config_content)
    
    try:
        subprocess.run([
            'openssl', 'req', '-new', '-x509', 
            '-nodes', '-days', '365',
            '-config', str(config_file),
            '-out', str(cert_file),
            '-keyout', str(key_file)
        ], check=True)
        print("✓ Certificates generated successfully:")
        print(f"- Certificate: {cert_file}")
        print(f"- Key: {key_file}")
    except subprocess.CalledProcessError as e:
        print(f"✗ Error generating certificates: {e}")
    
    print("\n")
    return cert_file, key_file

def suggest_commands(manage_py, cert_file, key_file):
    """Suggest commands to run the server"""
    print("="*40)
    print("SUGGESTED COMMANDS")
    print("="*40)
    
    # Get relative paths for cleaner commands
    try:
        rel_cert = os.path.relpath(cert_file, manage_py.parent)
        rel_key = os.path.relpath(key_file, manage_py.parent)
    except ValueError:
        rel_cert = str(cert_file)
        rel_key = str(key_file)
    
    print("Try these commands:")
    print("\n1. Using forward slashes (recommended for Windows Python):")
    print(f"cd {manage_py.parent}")
    print(f"python manage.py runsslserver --certificate={rel_cert.replace(os.sep, '/')} --key={rel_key.replace(os.sep, '/')} 0.0.0.0:8443")
    
    print("\n2. Using absolute paths:")
    print(f"python {manage_py} runsslserver --certificate=\"{cert_file}\" --key=\"{key_file}\" 0.0.0.0:8443")
    
    print("\n3. Navigate to directory first (simplest approach):")
    print(f"cd {manage_py.parent}")
    print(f"python manage.py runsslserver")

if __name__ == "__main__":
    check_environment()
    try:
        manage_py, cert_dir = check_project_structure()
        check_django_config(manage_py)
        cert_file, key_file = generate_certificates(cert_dir)
        suggest_commands(manage_py, cert_file, key_file)
    except Exception as e:
        print(f"Error during debug: {e}")
        import traceback
        traceback.print_exc()

import os
import sys
from pathlib import Path

def check_project_structure():
    """Check Django project structure and help with the SSL server command"""
    current_dir = Path(os.getcwd())
    
    print("Checking project structure...")
    print(f"Current directory: {current_dir}\n")
    
    # Check for manage.py in current directory
    if os.path.exists(current_dir / "manage.py"):
        print("✓ Found manage.py in current directory")
        manage_py_path = current_dir / "manage.py"
        base_dir = current_dir
        project_root_dir = current_dir.parent
    # Check for manage.py in backend subdirectory
    elif os.path.exists(current_dir / "backend" / "manage.py"):
        print("✓ Found manage.py in backend subdirectory")
        manage_py_path = current_dir / "backend" / "manage.py"
        base_dir = current_dir / "backend"
        project_root_dir = current_dir
    else:
        print("✗ Could not find manage.py in current directory or backend subdirectory")
        print("Make sure you're running this script from the Django project root or backend directory")
        return
    
    # Check for certs directory at the appropriate level
    certs_dir = base_dir / "certs"
    if os.path.exists(certs_dir):
        print(f"✓ Found certs directory at {certs_dir.relative_to(current_dir)}")
        
        # Check for certificate and key files
        cert_file = certs_dir / "localhost.crt"
        key_file = certs_dir / "localhost.key"
        
        if os.path.exists(cert_file) and os.path.exists(key_file):
            print("✓ Found SSL certificate and key files")
        else:
            print("✗ SSL certificate and/or key files are missing")
            print("  - Certificate should be at:", cert_file.relative_to(current_dir))
            print("  - Key should be at:", key_file.relative_to(current_dir))
    else:
        print(f"✗ Certs directory not found at {certs_dir.relative_to(current_dir)}")
        print(f"  Creating {certs_dir.relative_to(current_dir)} directory...")
        os.makedirs(certs_dir, exist_ok=True)
        
    # Display the correct command syntax
    print("\n===== RECOMMENDED COMMANDS =====")
    
    # If we're in project root and manage.py is in backend/
    if base_dir.name == "backend" and base_dir.parent == current_dir:
        print("Using paths relative to current directory:")
        print(f"python backend\\manage.py runsslserver --certificate=backend\\certs\\localhost.crt --key=backend\\certs\\localhost.key 0.0.0.0:8443")
        
        print("\nAlternatively, change to the backend directory first:")
        print("cd backend")
        print("python manage.py runsslserver --certificate=certs\\localhost.crt --key=certs\\localhost.key 0.0.0.0:8443")
    
    # If we're already in the backend directory
    else:
        print("Using paths relative to current directory:")
        print(f"python manage.py runsslserver --certificate=certs\\localhost.crt --key=certs\\localhost.key 0.0.0.0:8443")
    
    print("\nUsing absolute paths (works from any directory):")
    print(f"python {manage_py_path} runsslserver --certificate={certs_dir / 'localhost.crt'} --key={certs_dir / 'localhost.key'} 0.0.0.0:8443")
    
    print("\n===== TROUBLESHOOTING =====")
    print("If you see 'No such file or directory' errors:")
    print("1. Make sure the paths in your command match your project structure")
    print("2. Try using absolute paths (shown above)")
    print("3. Double-check that certificate files exist in the correct location")
    print("4. If using backslashes (\\) in Windows, escape them properly in commands")

if __name__ == "__main__":
    check_project_structure()

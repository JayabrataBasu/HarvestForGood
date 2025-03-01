"""
Script to update Django settings.py to include django_extensions.
"""
import os
import re
from pathlib import Path

def update_settings():
    """Update settings.py to include django_extensions."""
    # Find settings.py
    base_dir = Path(__file__).resolve().parent
    settings_path = base_dir / 'core' / 'settings.py'
    
    if not settings_path.exists():
        print(f"Settings file not found at {settings_path}")
        return False
    
    # Read settings file
    with open(settings_path, 'r') as f:
        settings_content = f.read()
    
    # Check if django_extensions is already in INSTALLED_APPS
    if 'django_extensions' in settings_content:
        print("django_extensions is already in INSTALLED_APPS")
        return True
    
    # Add django_extensions to INSTALLED_APPS
    pattern = r'(INSTALLED_APPS\s*=\s*\[[\s\S]*?)(\'sslserver\'.*?,)([\s\S]*?\])'
    replacement = r'\1\2\n    \'django_extensions\',\3'
    
    updated_content = re.sub(pattern, replacement, settings_content)
    
    # Check if replacement was successful
    if updated_content == settings_content:
        # Try an alternative approach if the first pattern didn't match
        pattern = r'(INSTALLED_APPS\s*=\s*\[[\s\S]*?)(\'django\.contrib\.staticfiles\'.*?,)([\s\S]*?\])'
        replacement = r'\1\2\n    \'django_extensions\',\3'
        updated_content = re.sub(pattern, replacement, settings_content)
    
    # Write updated content back to the file
    with open(settings_path, 'w') as f:
        f.write(updated_content)
    
    print(f"Updated {settings_path} to include django_extensions")
    return True

if __name__ == "__main__":
    update_settings()

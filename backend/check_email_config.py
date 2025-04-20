"""
Utility script to check email configuration in your Django project.
This will verify settings and provide suggestions for troubleshooting.
"""
import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_email_config():
    print("\n===== EMAIL CONFIGURATION CHECKER =====\n")
    
    # Check environment variables
    email_backend = os.environ.get('EMAIL_BACKEND')
    email_host = os.environ.get('EMAIL_HOST')
    email_port = os.environ.get('EMAIL_PORT')
    email_host_user = os.environ.get('EMAIL_HOST_USER')
    email_host_password = os.environ.get('EMAIL_HOST_PASSWORD')
    email_use_tls = os.environ.get('EMAIL_USE_TLS')
    
    print("Environment Variables:")
    print(f"  EMAIL_BACKEND: {email_backend or 'Not set'}")
    print(f"  EMAIL_HOST: {email_host or 'Not set'}")
    print(f"  EMAIL_PORT: {email_port or 'Not set'}")
    print(f"  EMAIL_HOST_USER: {email_host_user or 'Not set'}")
    print(f"  EMAIL_HOST_PASSWORD: {'Set' if email_host_password else 'Not set'}")
    print(f"  EMAIL_USE_TLS: {email_use_tls or 'Not set'}")
    
    # Check for potential issues
    issues = []
    
    if not email_backend:
        issues.append("EMAIL_BACKEND is not set. Default will be used.")
    
    if 'filebased' in email_backend:
        file_path = os.environ.get('EMAIL_FILE_PATH')
        print(f"  EMAIL_FILE_PATH: {file_path or 'Not set'}")
        
        if not file_path:
            issues.append("EMAIL_FILE_PATH not set but using file-based email backend.")
        else:
            # Check if the directory exists and is writable
            path = Path(file_path)
            if not path.exists():
                issues.append(f"EMAIL_FILE_PATH directory '{file_path}' does not exist.")
            elif not os.access(file_path, os.W_OK):
                issues.append(f"EMAIL_FILE_PATH directory '{file_path}' is not writable.")
    
    if 'smtp' in email_backend:
        if not email_host:
            issues.append("EMAIL_HOST not set but using SMTP email backend.")
        
        if not email_port:
            issues.append("EMAIL_PORT not set but using SMTP email backend.")
        
        if not email_host_user:
            issues.append("EMAIL_HOST_USER not set but using SMTP email backend.")
        
        if not email_host_password:
            issues.append("EMAIL_HOST_PASSWORD not set but using SMTP email backend.")
    
    # Print issues and suggestions
    if issues:
        print("\nPotential Issues:")
        for i, issue in enumerate(issues, 1):
            print(f"  {i}. {issue}")
        
        print("\nSuggestions:")
        if 'smtp' in email_backend:
            print("  - For SMTP with Gmail, make sure to:")
            print("    a. Generate an App Password in your Google Account")
            print("    b. Use that App Password instead of your regular password")
            print("    c. Make sure 'Less secure app access' is enabled in your Google account")
        
        print("  - For development, consider using the console backend:")
        print("    EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend")
        
        print("  - For testing with file-based backend:")
        print("    EMAIL_BACKEND=django.core.mail.backends.filebased.EmailBackend")
        print("    EMAIL_FILE_PATH=./sent_emails")
    else:
        print("\nNo issues detected in your email configuration.")

    print("\n===== END OF CONFIGURATION CHECK =====\n")

if __name__ == "__main__":
    check_email_config()

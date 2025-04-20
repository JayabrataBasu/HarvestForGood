import os
import sys
import django
from pathlib import Path

# Setup BASE_DIR before Django initialization
BASE_DIR = Path(__file__).resolve().parent

# Make sure we can import our Django settings
sys.path.append(str(BASE_DIR))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    django.setup()
except Exception as e:
    print(f"Failed to initialize Django: {str(e)}")
    
    # Try fallback to config.settings if present
    try:
        os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
        django.setup()
        print("Successfully initialized Django with config.settings")
    except Exception as e2:
        print(f"Also failed with config.settings: {str(e2)}")
        sys.exit(1)

from django.core.mail import EmailMessage, get_connection
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_email_sending():
    """
    Simple test function to verify email sending works
    """
    try:
        # Get email settings from environment for debugging
        print("\nEmail Settings:")
        print(f"EMAIL_HOST: {os.environ.get('EMAIL_HOST', 'Not set')}")
        print(f"EMAIL_PORT: {os.environ.get('EMAIL_PORT', 'Not set')}")
        print(f"EMAIL_HOST_USER: {os.environ.get('EMAIL_HOST_USER', 'Not set')}")
        print(f"EMAIL_HOST_PASSWORD: {'Set' if os.environ.get('EMAIL_HOST_PASSWORD') else 'Not set'}")
        print(f"EMAIL_BACKEND: {os.environ.get('EMAIL_BACKEND', 'Not set')}")
        
        # Create sent_emails directory if it doesn't exist
        email_dir = BASE_DIR / 'sent_emails'
        email_dir.mkdir(exist_ok=True)
        print(f"\nEmail files will be saved to: {email_dir}")
        
        # Set up the file-based connection
        connection = get_connection(
            backend='django.core.mail.backends.filebased.EmailBackend',
            file_path=str(email_dir)
        )
        
        # Attempt to send a test email
        recipient_email = input("\nEnter email address to send test to: ")
        subject = 'Harvest For Good - Test Email'
        message = """
        <html>
        <body>
            <h1 style="color: #2C7A2A;">Harvest For Good - Test Email</h1>
            <p>This is a test email to verify that the email sending configuration is working properly.</p>
            <p>If you can see this message, the email system is configured correctly!</p>
            <div style="background-color: #F4F9F4; padding: 15px; border-left: 4px solid #2C7A2A;">
                <p>This email was sent from the test script.</p>
            </div>
        </body>
        </html>
        """
        from_email = os.environ.get('EMAIL_HOST_USER', 'test@example.com')
        
        # Create the email message with the connection
        email = EmailMessage(
            subject, 
            message, 
            from_email, 
            [recipient_email],
            connection=connection  # Use connection instead of backend
        )
        email.content_subtype = "html"  # Set the content type to HTML
        result = email.send()
        
        if result:
            print(f"\nTest email sent successfully to {recipient_email}")
            print(f"Check the 'sent_emails' directory for the email file")
        else:
            print("\nFailed to send test email. Result was 0.")
    
    except Exception as e:
        print(f"\nError sending test email: {str(e)}")

if __name__ == "__main__":
    test_email_sending()

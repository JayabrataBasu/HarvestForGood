# test_manual_email.py
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from apps.users.models import User

def test_direct_email():
    """Test direct email sending"""
    try:
        send_mail(
            subject='Test Email from Django',
            message='This is a test email to verify SMTP configuration.',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['jayabratabasu@gmail.com'],
            fail_silently=False,
        )
        print("Basic email test: SUCCESS")
    except Exception as e:
        print(f"Basic email test FAILED: {e}")

def test_template_email():
    """Test template-based email sending"""
    try:
        context = {
            'user': {'username': 'testuser'},
            'domain': 'localhost:8000',
            'uid': 'test-uid',
            'token': 'test-token'
        }
        
        message = render_to_string('users/email_verification.html', context)
        email = EmailMessage(
            'Template Test Email',
            message,
            settings.EMAIL_HOST_USER,
            ['jayabratabasu@gmail.com']
        )
        email.content_subtype = "html"
        email.send()
        print("Template email test: SUCCESS")
    except Exception as e:
        print(f"Template email test FAILED: {e}")

if __name__ == "__main__":
    print("Starting email tests...")
    test_direct_email()
    test_template_email()

# test_complete_flow.py
import os
import django
import time
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import TestCase, override_settings
from django.core import mail
from apps.users.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
import json

@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    EMAIL_VERIFICATION=None,
    ACCOUNT_EMAIL_VERIFICATION='none'
)
class UserFlowTester(TestCase):
    def setUp(self):
        self.test_email = f'test_user_{int(time.time())}@example.com'
        self.test_password = 'TestPass123!'
        self.test_username = f'testflow_user_{int(time.time())}'
        
        # Create and activate user for login and password reset tests
        self.user = User.objects.create_user(
            username=self.test_username,
            email=self.test_email,
            password=self.test_password
        )
        self.user.is_active = True
        self.user.email_verified = True
        self.user.save()
        
        # Clear mail outbox at start
        mail.outbox = []

    def test_registration(self):
        """Test user registration process"""
        data = {
            'username': f'new_{self.test_username}',  # New username for registration
            'email': f'new_{self.test_email}',  # New email for registration
            'password': self.test_password,
            'password2': self.test_password
        }
        
        response = self.client.post('/api/users/register/', data)
        self.assertEqual(response.status_code, 201, "Registration failed")
        self.assertTrue(len(mail.outbox) > 0, "Verification email not sent")
        return True

    def test_email_verification(self):
        """Test email verification process"""
        mail.outbox = []  # Clear previous emails
        
        # Use the registration endpoint instead since it sends verification email
        data = {
            'username': f'new_{self.test_username}',
            'email': f'new_{self.test_email}',
            'password': self.test_password,
            'password2': self.test_password
        }
        response = self.client.post('/api/users/register/', data)
        
        self.assertTrue(len(mail.outbox) > 0, "Verification email not sent")
        email = mail.outbox[0]
        self.assertIn('Verify your email', email.subject)


    def test_login(self):
        """Test user login process"""
        data = {
            'username': self.test_username,
            'password': self.test_password
        }
        
        response = self.client.post('/api/token/', data)
        self.assertEqual(response.status_code, 200, "Login failed")
        
        content = json.loads(response.content)
        self.assertIn('access', content, "No access token in response")
        return content.get('access')

    def test_password_reset(self):
        """Test password reset process"""
        mail.outbox = []  # Clear previous emails
        
        data = {'email': self.test_email}
        response = self.client.post('/api/users/password/reset/', data)
        
        self.assertEqual(response.status_code, 200, "Password reset request failed")
        self.assertTrue(len(mail.outbox) > 0, "Password reset email not sent")
        
        reset_email = mail.outbox[0]
        self.assertIn('Password Reset', reset_email.subject, "Incorrect reset email subject")

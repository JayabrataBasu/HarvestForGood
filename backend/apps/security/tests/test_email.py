# apps/security/tests/test_email.py
from django.core import mail
from django.test import TestCase
from apps.security.monitoring import SecurityMonitor
from django.contrib.auth import get_user_model

class EmailTest(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(
            username='testuser',
            email='jayabratabasu@gmail.com',  # Your actual email for testing
            password='testpass123'
        )
        self.monitor = SecurityMonitor()

    def test_email_sending(self):
        # Test direct email sending
        mail.send_mail(
            'Test Email',
            'This is a test email. God I hope this works',
            'from@example.com',
            ['jayabratabasu@gmail.com'],  # Your email
            fail_silently=False,
        )
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Test Email')

    def test_security_alert_email(self):
        # Test security monitor email
        self.monitor.log_suspicious_activity(
            self.user,
            'test_activity',
            'Testing security alerts'
        )

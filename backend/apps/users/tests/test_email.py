# apps/users/tests/test_email.py
from django.test import TestCase
from django.core import mail
from django.conf import settings
import smtplib

class EmailTest(TestCase):
    def test_smtp_connection(self):
        """Test direct SMTP connection"""
        try:
            smtp = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
            smtp.ehlo()
            smtp.starttls()
            smtp.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
            print("SMTP connection successful")
            smtp.quit()
            self.assertTrue(True)
        except Exception as e:
            self.fail(f"SMTP connection failed: {str(e)}")

    def test_django_email(self):
        """Test Django's email functionality"""
        try:
            mail.send_mail(
                'Test Subject',
                'Test message content',
                settings.EMAIL_HOST_USER,
                [settings.EMAIL_HOST_USER],  # Sending to yourself for testing
                fail_silently=False,
            )
            self.assertEqual(len(mail.outbox), 1)
        except Exception as e:
            self.fail(f"Email sending failed: {str(e)}")

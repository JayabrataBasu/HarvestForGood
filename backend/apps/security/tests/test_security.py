# apps/security/tests/test_security.py
from django.test import TestCase, RequestFactory
from django.core.cache import cache
from django.contrib.auth import get_user_model
from apps.security.middleware import IPSecurityMiddleware
from apps.security.monitoring import SecurityMonitor

class TestIPSecurityMiddleware(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = IPSecurityMiddleware(lambda request: None)
        cache.clear()

    def test_ip_blacklisting(self):
        request = self.factory.get('/')
        request.META['REMOTE_ADDR'] = '127.0.0.1'
        
        # Simulate suspicious activity
        for _ in range(101):
            self.middleware.process_request(request)
        
        self.assertIn('127.0.0.1', self.middleware.blacklisted_ips)

class TestSecurityMonitor(TestCase):
    def setUp(self):
        User = get_user_model()
        self.monitor = SecurityMonitor()
        self.user = User.objects.create_user(
            username='jayabasu', 
            email='jayabratabasu@gmail.com',  # Use your email for testing
            password='Chin2b@su'
        )
        cache.clear()

    def test_suspicious_activity_logging(self):
        for _ in range(6):
            self.monitor.log_suspicious_activity(
                self.user, 
                'login_attempt', 
                'Failed login'
            )

# apps/security/monitoring.py
from django.core.cache import cache
from django.core.mail import send_mail

class SecurityMonitor:
    def log_suspicious_activity(self, user, activity_type, details):
        cache_key = f"suspicious_{user.id}_{activity_type}"
        count = cache.get(cache_key, 0) + 1
        if count > 5:
            self.alert_admin(user, activity_type)
        cache.set(cache_key, count, 3600)
    
    def alert_admin(self, user, activity_type):
        send_mail(
            'Suspicious Activity Detected',
            f'Multiple suspicious activities detected for user {user.username}',
            'from@example.com',
            ['admin@example.com'],
            fail_silently=False,
        )

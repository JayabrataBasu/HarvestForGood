# apps/security/middleware.py
from django.http import HttpResponse
from django.core.cache import cache
from django.utils.crypto import constant_time_compare
from django.conf import settings
import hmac
import hashlib
import time

class IPSecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.blacklisted_ips = cache.get('blacklisted_ips', set())

    def __call__(self, request):
        if request.META.get('REMOTE_ADDR') in self.blacklisted_ips:
            return HttpResponse('Access denied', status=403)
        return self.get_response(request)

    def process_request(self, request):
        ip = request.META.get('REMOTE_ADDR')
        if self._is_suspicious_activity(ip):
            self.blacklisted_ips.add(ip)
            cache.set('blacklisted_ips', self.blacklisted_ips, 86400)  # 24 hours
            return HttpResponse('Access denied', status=403)

    def _is_suspicious_activity(self, ip):
        cache_key = f'requests_{ip}'
        requests = cache.get(cache_key, 0)
        if requests > 100:  # Threshold
            return True
        cache.set(cache_key, requests + 1, 60)  # 1 minute window
        return False





class APISecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.signing_key = settings.SECRET_KEY.encode()

    def __call__(self, request):
        if request.path.startswith('/api/'):
            # Skip signature check for authentication endpoints
            if request.path.startswith(('/api/token/', '/api/users/register/', '/api/research/papers/')):
                return self.get_response(request)

            # Verify timestamp and signature for other API endpoints
            timestamp = request.headers.get('X-Timestamp')
            if not self._verify_timestamp(timestamp):
                return HttpResponse('Request expired', status=403)

            if not self._verify_signature(request):
                return HttpResponse('Invalid signature', status=403)

        return self.get_response(request)

    def _verify_timestamp(self, timestamp):
        try:
            timestamp = float(timestamp)
            return abs(time.time() - timestamp) < 300  # 5-minute window
        except (TypeError, ValueError):
            return False

    def _verify_signature(self, request):
        provided_signature = request.headers.get('X-API-Signature')
        if not provided_signature:
            return False

        payload = f"{request.path}{request.headers.get('X-Timestamp', '')}"
        expected_signature = hmac.new(
            self.signing_key,
            payload.encode(),
            hashlib.sha256
        ).hexdigest()

        return constant_time_compare(provided_signature, expected_signature)

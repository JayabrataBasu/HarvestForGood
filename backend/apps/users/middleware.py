# apps/users/middleware.py
from datetime import timedelta
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.http import HttpResponse
from django.utils.crypto import constant_time_compare
import hmac, hashlib
from datetime import datetime

class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        auth = super().authenticate(request)
        if auth is None:
            return None
        user, token = auth
        if token.created < timezone.now() - timedelta(minutes=5):
            raise AuthenticationFailed('Token has expired')
        return auth

class APISecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.secret_key = 'your-secret-key-here'  # Move to settings in production

    def __call__(self, request):
        if request.path.startswith('/api/'):
            timestamp = request.headers.get('X-Timestamp')
            if not self._validate_timestamp(timestamp):
                return HttpResponse('Request expired', status=403)
            
            if not self._validate_signature(request):
                return HttpResponse('Invalid signature', status=403)
        
        return self.get_response(request)

    def _validate_timestamp(self, timestamp):
        try:
            request_time = datetime.fromtimestamp(int(timestamp))
            now = datetime.now()
            return abs((now - request_time).total_seconds()) < 300
        except:
            return False

    def _validate_signature(self, request):
        signature = request.headers.get('X-API-Signature')
        if not signature:
            return False
        
        # Create expected signature
        payload = f"{request.path}{request.headers.get('X-Timestamp')}"
        expected_signature = hmac.new(
            self.secret_key.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return constant_time_compare(signature, expected_signature)

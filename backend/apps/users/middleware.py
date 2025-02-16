from datetime import timedelta
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate(self, request):
        auth = super().authenticate(request)
        if auth is None:
            return None
        user, token = auth
        if token.created < timezone.now() - timedelta(minutes=5):  # Change days=1 to minutes=1
         raise AuthenticationFailed('Token has expired')

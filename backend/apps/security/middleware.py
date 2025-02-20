# apps/security/middleware.py
from django.http import HttpResponse
from django.core.cache import cache

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

from django.contrib import admin
from django.utils.html import format_html
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.urls import path
from django.http import JsonResponse
from django.core.cache import cache
import json

class SecurityAdminSite(admin.ModelAdmin):
    """Custom admin site for security monitoring"""
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            #path('security-dashboard/', self.admin_site.admin_view(self.security_dashboard), name='security_dashboard'),
            path('security-logs/', self.admin_site.admin_view(self.security_logs), name='security_logs'),
        ]
        return custom_urls + urls
    
    def security_dashboard(self, request):
        """Security monitoring dashboard"""
        context = {
            'title': 'Security Dashboard',
            'recent_alerts': self.get_recent_alerts(),
            'failed_logins': self.get_failed_login_attempts(),
            'suspicious_activities': self.get_suspicious_activities(),
        }
        return render(request, 'admin/security_dashboard.html', context)
    
    def security_logs(self, request):
        """Security logs view"""
        logs = self.get_security_logs()
        return JsonResponse({'logs': logs})
    
    def get_recent_alerts(self):
        """Get recent security alerts from cache"""
        return cache.get('security_alerts', [])
    
    def get_failed_login_attempts(self):
        """Get failed login attempts"""
        return cache.get('failed_logins', [])
    
    def get_suspicious_activities(self):
        """Get suspicious activities"""
        return cache.get('suspicious_activities', [])
    
    def get_security_logs(self):
        """Get security logs"""
        return cache.get('security_logs', [])

# Register the security admin
#admin.site.register_view('security/', view=SecurityAdminSite().security_dashboard, name='Security Dashboard')

"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.users.views import CustomTokenObtainPairView

# Customize admin site
admin.site.site_header = "Harvest For Good Administration"
admin.site.site_title = "Harvest For Good Admin"
admin.site.index_title = "Welcome to Harvest For Good Administration"

# Create a simple API root view
@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'Harvest For Good API is working!',
        'endpoints': {
            'forum_posts': '/api/forum/posts/',
            'research_papers': '/api/research/papers/',
            'admin': '/admin/',
            'auth': '/api/auth/',
            'password_reset': '/api/users/password/reset/',  # Add this line
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Custom token endpoint
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Other API endpoints
    path('api/users/', include('apps.users.urls')),
    path('api/forums/', include('apps.forums.urls')),  # plural version
    path('api/forum/', include('apps.forum.urls')),   # singular version - add this line
    path('api/academic/', include('apps.academic.urls')),
    path('api/research/', include('apps.research.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('', TemplateView.as_view(template_name='api_root.html'), name='api-root'),
]

# Serve static and media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

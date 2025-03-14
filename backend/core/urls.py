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
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Define a view for the API root
def api_root(request):
    """
    API root view that provides basic information about the API endpoints
    """
    api_endpoints = {
        "message": "Welcome to the Harvest For Good API",
        "version": "1.0",
        "endpoints": {
            "auth": {
                "token": "/api/token/",
                "refresh": "/api/token/refresh/",
                "registration": "/api/auth/registration/",
            },
            "users": "/api/users/",
            "forum": "/api/forum/posts/",
            "academic": "/api/academic/",
        },
        "documentation": "For more information, contact the development team",
        "frontend": "This is a backend API server. The frontend is running on a separate server (typically http://localhost:3000)"
    }
    return JsonResponse(api_endpoints)

urlpatterns = [
    # Root URL - API documentation
    path('', api_root, name='api_root'),
    
    # Admin site
    path('admin/', admin.site.urls),
    
    # Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Include app URLs - make sure the path matches what the frontend expects
    path('api/users/', include('apps.users.urls')),
    path('api/forum/', include('apps.forum.urls')),
    path('api/academic/', include('apps.academic.urls')),
    
    # Add dj-rest-auth URLs
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
]

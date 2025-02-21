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
from django.urls import path, include, re_path
from django.views.generic import RedirectView, TemplateView
from rest_framework.authtoken import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('', RedirectView.as_view(url='/admin/')),  # Redirect root to admin
    path('admin/', admin.site.urls),
    
    # User-related endpoints
    path('api/users/', include('apps.users.urls')),  
    
    # App-specific endpoints
    path('api/academic/', include('apps.academic.urls')),
    path('api/forum/', include('apps.forum.urls')),

    # Auth & Token Authentication
    path('api-auth/', include('rest_framework.urls')),
    path('api-token-auth/', views.obtain_auth_token),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # dj-rest-auth (Unified)
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    # core/urls.py
    path('api/', include('apps.security.urls')),


    # Email Verification
    re_path(
        r'^verify-email/(?P<key>[-:\w]+)/$',
        TemplateView.as_view(),
        name='account_email_verification_sent',
    ),
]

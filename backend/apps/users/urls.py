from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, MeView, password_reset_request, password_reset_confirm
from . import views

router = DefaultRouter()
router.register(r'', UserViewSet)

urlpatterns = [
    # Authentication and user management endpoints
    path('me/', MeView.as_view(), name='me'),
    path('register/', RegisterView.as_view(), name='register'),
    
    # Custom password reset endpoints - these handle the frontend requests
    path('password/reset/', password_reset_request, name='custom_password_reset'),
    path('password/reset/confirm/<uidb64>/<token>/', password_reset_confirm, name='custom_password_reset_confirm'),
    
    # Email verification endpoints
    path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify_email'),
    path('resend-verification-email/', 
         views.resend_verification_email, 
         name='resend-verification-email'),
    path('send-welcome-email/',
         views.send_welcome_email,
         name='send-welcome-email'),
    
    # Include the router URLs at the end to avoid conflicts
    path('', include(router.urls)),
]

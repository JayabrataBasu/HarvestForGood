from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Fix the import statement
from .views import UserViewSet, RegisterView, MeView, password_reset_request, password_reset_confirm
from . import views
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView
from .views import contact_message

router = DefaultRouter()
router.register(r'', UserViewSet)  # Changed from 'users' to '' since we're already in the users namespace

urlpatterns = [
    # Add the "me" endpoint before the router includes
    path('me/', MeView.as_view(), name='me'),
    path('contact/', contact_message, name='contact-message'), #contact us page url
    
    path('register/', RegisterView.as_view(), name='register'),
    
    # Custom password reset endpoints - THESE WILL TAKE PRECEDENCE
    path('password/reset/', password_reset_request, name='custom_password_reset'),
    path('password/reset/confirm/<uidb64>/<token>/', password_reset_confirm, name='custom_password_reset_confirm'),
    
    # dj_rest_auth endpoints (these will be shadowed by the above)
    # path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
    # path('password/reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    path('verify-email/<str:uidb64>/<str:token>/', 
         views.verify_email, 
         name='verify_email'),
    path('resend-verification-email/', 
         views.resend_verification_email, 
         name='resend-verification-email'),
    path('send-welcome-email/',
         views.send_welcome_email,
         name='send-welcome-email'),
    
    # Include the router URLs at the end to avoid conflicts
    path('', include(router.urls)),
]

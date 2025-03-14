from django.urls import path, include
from rest_framework.routers import DefaultRouter
# Fix the import statement
from .views import UserViewSet, RegisterView, MeView
from . import views
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView

router = DefaultRouter()
router.register(r'', UserViewSet)  # Changed from 'users' to '' since we're already in the users namespace

urlpatterns = [
    # Add the "me" endpoint before the router includes
    path('me/', MeView.as_view(), name='me'),
    
    path('register/', RegisterView.as_view(), name='register'),
    path('password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password/reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('verify-email/<str:uidb64>/<str:token>/', 
         views.verify_email, 
         name='verify_email'),
    path('resend-verification/', 
         views.resend_verification_email, 
         name='resend_verification'),
    path('resend-verification-email/', views.resend_verification_email, name='resend-verification-email'),
    
    # Include the router URLs at the end to avoid conflicts
    path('', include(router.urls)),
]

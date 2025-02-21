# apps/security/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('email-settings/', views.email_settings, name='email-settings'),
    path('test-email/', views.test_email, name='test-email'),
]

# apps/users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'date_joined', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('role', 'is_active', 'date_joined')

# apps/users/validators.py
from django.core.exceptions import ValidationError
import re

class PasswordPolicyValidator:
    def validate(self, password, user=None):
        if len(password) < 12:
            raise ValidationError('Password must be at least 12 characters long.')
        
        if not re.search(r'[A-Z]', password):
            raise ValidationError('Password must contain uppercase letters.')
            
        if not re.search(r'[a-z]', password):
            raise ValidationError('Password must contain lowercase letters.')
            
        if not re.search(r'\d', password):
            raise ValidationError('Password must contain numbers.')
            
        if not re.search(r'[@$!%*#?&]', password):
            raise ValidationError('Password must contain special characters.')

class UserSecurityValidator:
    def validate(self, user):
        if user.email and not user.email_verified:
            raise ValidationError('Email must be verified before performing this action.')

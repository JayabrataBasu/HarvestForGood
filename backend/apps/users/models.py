from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, default='user')
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    email_verified = models.BooleanField(default=False)
    affiliation = models.CharField(max_length=255, null=False, blank=True, default="")

"""
Development settings for the project.
Use this file by running:
    python manage.py runserver --settings=core.settings_dev
"""

from .settings import *

# Override settings for development
DEBUG = True

# Security settings appropriate for development
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Simplified database for development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Additional development apps
INSTALLED_APPS += [
    'debug_toolbar',
]

MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware'] + MIDDLEWARE

INTERNAL_IPS = [
    '127.0.0.1',
]

# Email settings for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Email settings
EMAIL_BACKEND = os.environ.get(
    'EMAIL_BACKEND', 
    'django.core.mail.backends.filebased.EmailBackend'  # Default to file-based for development
)
if EMAIL_BACKEND == 'django.core.mail.backends.filebased.EmailBackend':
    EMAIL_FILE_PATH = os.environ.get('EMAIL_FILE_PATH', os.path.join(BASE_DIR, 'sent_emails'))
    # Create directory if it doesn't exist
    os.makedirs(EMAIL_FILE_PATH, exist_ok=True)

EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER if EMAIL_HOST_USER else 'noreply@harvestforgood.org'

# Debug setting - make sure it's defined
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# Add this after your DEFAULT_FROM_EMAIL setting (around line 27)

# Frontend URL configuration for password reset links
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://harvestforgood.vercel.app')

# Ensure proper URL format (remove trailing slash if present)
if FRONTEND_URL.endswith('/'):
    FRONTEND_URL = FRONTEND_URL.rstrip('/')

# Add logging configuration for SMTP
if DEBUG:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
            },
        },
        'loggers': {
            'django.request': {
                'handlers': ['console'],
                'level': 'DEBUG',
                'propagate': True,
            },
            'django.security': {
                'handlers': ['console'],
                'level': 'DEBUG',
                'propagate': True,
            },
            'django.core.mail': {
                'handlers': ['console'],
                'level': 'DEBUG',
                'propagate': True,
            },
        },
    }
from .settings import *

# Debug Settings
#DEBUG = False
#ALLOWED_HOSTS = []  # Add domains during deployment

# Security Settings
#SECURE_SSL_REDIRECT = True
#SESSION_COOKIE_SECURE = True
#CSRF_COOKIE_SECURE = True
#SECURE_BROWSER_XSS_FILTER = True
#SECURE_CONTENT_TYPE_NOSNIFF = True
#X_FRAME_OPTIONS = 'DENY'

# HSTS Settings
#SECURE_HSTS_SECONDS = 31536000  # 1 year
#SECURE_HSTS_INCLUDE_SUBDOMAINS = True
#SECURE_HSTS_PRELOAD = True

# Cookie Settings
#SESSION_COOKIE_HTTPONLY = True
#CSRF_COOKIE_HTTPONLY = True
#CSRF_COOKIE_SAMESITE = 'Strict'
#SESSION_COOKIE_SAMESITE = 'Strict'

# File Upload Restrictions
#FILE_UPLOAD_MAX_MEMORY_SIZE = 2621440  # 2.5 MB
#DATA_UPLOAD_MAX_MEMORY_SIZE = 2621440  # 2.5 MB

# Database (You might want to modify these for production)
'''DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_prod_db_name',
        'USER': 'your_prod_db_user',
        'PASSWORD': 'your_prod_db_password',
        'HOST': 'your_prod_db_host',
        'PORT': '5432',
    }
}

# Email Configuration (Update with production email settings)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'your_smtp_host'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your_email@domain.com'
EMAIL_HOST_PASSWORD = 'your_email_password'

# Static files
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = '/static/'

# Media files
MEDIA_ROOT = BASE_DIR / 'mediafiles'
MEDIA_URL = '/media/'
'''
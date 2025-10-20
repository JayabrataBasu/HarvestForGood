# Email Fix: Migration to Resend HTTP API

## What Was Changed

### 1. Created New Email Service (`backend/apps/utils/email_service.py`)
- Uses Resend HTTP API instead of SMTP
- Non-blocking, reliable email delivery
- No timeout issues that crash workers
- Functions for contact form, password reset, and welcome emails

### 2. Updated Views (`backend/apps/users/views.py`)
- `RegisterView.send_verification_email()` - Now uses `send_welcome_email()`
- `contact()` - Now uses `send_contact_form_email()`
- `password_reset_request()` - Now uses `send_password_reset_email()`

## Railway Environment Variables to Update

Go to Railway Dashboard → Your Backend Service → Variables and update these:

### Required Changes:
```
# Resend API Configuration
RESEND_API_KEY=re_hNoT7X4t_KU9t9UQA4op6UTWmyLZkfHZ3
DEFAULT_FROM_EMAIL=noreply@harvestforgood.org
ADMIN_EMAIL=contact@harvestforgood.org

# Frontend URL (updated domain)
FRONTEND_URL=https://harvestforgood.org

# Remove or comment out (no longer needed):
# EMAIL_HOST=smtp.resend.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_PASSWORD=... (keep as backup or use for RESEND_API_KEY)
```

### CORS & CSRF (should already be correct):
```
CORS_ALLOWED_ORIGINS=https://harvestforgood.org,https://www.harvestforgood.org
CSRF_TRUSTED_ORIGINS=https://harvestforgood.org,https://www.harvestforgood.org
```

## Deployment Steps

1. **Commit the changes:**
   ```bash
   cd c:/Users/jayab/HarvestForGood
   git add backend/apps/utils/email_service.py
   git add backend/apps/users/views.py
   git commit -m "Fix email: Switch to Resend HTTP API for reliable delivery"
   git push origin master
   ```

2. **Update Railway Environment Variables:**
   - Go to https://railway.app/dashboard
   - Select your backend service
   - Click "Variables" tab
   - Add/update the variables listed above
   - Save changes

3. **Railway will auto-deploy** when it detects the git push

4. **Test the email features:**
   - Contact form: https://harvestforgood.org/contact
   - Password reset: https://harvestforgood.org/reset-password
   - Registration welcome email: Create a new account

## Why This Fixes the Problem

### Before (SMTP):
- ❌ SMTP connection could timeout (30+ seconds)
- ❌ Timeouts killed Gunicorn workers
- ❌ Worker crashes took down entire backend
- ❌ Blocking I/O delayed HTTP responses

### After (HTTP API):
- ✅ HTTP API calls are fast (<1 second)
- ✅ No worker timeouts
- ✅ Non-blocking execution
- ✅ Better error messages
- ✅ More reliable delivery

## Verify It's Working

After deployment, check Railway logs for:
```
✅ "Sending email via Resend API to..."
✅ "Email sent successfully: {'id': '...'}"
```

Instead of:
```
❌ "[CRITICAL] WORKER TIMEOUT"
❌ "Worker was sent SIGKILL"
```

## Rollback Plan (if needed)

If something goes wrong, you can temporarily disable emails:
```python
# In Railway Variables, add:
DISABLE_EMAILS=True

# Then in settings.py, add at the top of email config:
if os.getenv('DISABLE_EMAILS') == 'True':
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

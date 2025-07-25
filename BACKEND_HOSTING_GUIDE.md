# Harvest For Good - Backend Hosting Guide (Django + PostgreSQL on Render.com)

## 1. Prepare Your Django Project

- Ensure your `.env.production` file is complete:
  ```
  DJANGO_SECRET_KEY=your_secure_secret_key
  DB_NAME=your_db_name
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_HOST=your_db_host
  DB_PORT=your_db_port
  EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
  EMAIL_HOST=smtp.yourprovider.com
  EMAIL_PORT=587
  EMAIL_USE_TLS=True
  EMAIL_HOST_USER=your_email_user
  EMAIL_HOST_PASSWORD=your_email_password
  ```
- Update `requirements.txt`:
  ```bash
  pip freeze > requirements.txt
  ```
- Collect static files:
  ```bash
  python manage.py collectstatic --noinput
  ```

## 2. Push Your Code to GitHub

- Commit and push your Django backend code to a GitHub repository.

## 3. Create a Free PostgreSQL Database

- In Render dashboard, click "New" > "PostgreSQL".
- Copy the connection string for your `.env.production`.

## 4. Deploy Django on Render

- Click "New" > "Web Service".
- Connect your GitHub repo.
- Set build command: `pip install -r requirements.txt`
- Set start command: `gunicorn core.wsgi:application`
- Add environment variables from `.env.production`.

## 5. Static & Media Files

- Use [Whitenoise](https://whitenoise.evans.io/) for static files.
- For media, use Amazon S3 or similar if needed.

## 6. HTTPS & Monitoring

- Render provides free HTTPS and logs.

## 7. Maintenance

- Push to GitHub to auto-deploy.
- Update environment variables in Render dashboard.

---

**Summary:**  
Render.com is the easiest, lowest-cost option for Django + PostgreSQL. Free tier, simple deploys, and no server management.

# Harvest For Good - Backend Hosting Guide (Django + PostgreSQL on Hostinger)

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

## 2. Upload Your Code to Hostinger

- Use SFTP or Git to upload your backend code to your Hostinger account.
- Place your code in `/home/yourusername/harvestforgood/backend`.

## 3. Set Up Python Environment

```bash
ssh yourusername@yourserver
cd ~/harvestforgood/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.production .env
```

## 4. Configure Database

- Create a PostgreSQL database in Hostinger’s control panel.
- Update `.env` and `core/settings.py` with your DB credentials.
- Run migrations:
  ```bash
  python manage.py migrate
  python manage.py createsuperuser
  ```

## 5. Configure uWSGI

- Create `uwsgi.ini` in your backend folder:
  ```ini
  [uwsgi]
  project = harvestforgood
  base = /home/yourusername
  chdir = %(base)/%(project)/backend
  home = %(base)/%(project)/backend/venv
  module = core.wsgi:application
  master = true
  processes = 5
  socket = %(base)/%(project)/%(project).sock
  chmod-socket = 666
  vacuum = true
  daemonize = %(base)/%(project)/uwsgi.log
  ```

- Start uWSGI:
  ```bash
  uwsgi --ini uwsgi.ini
  ```

## 6. Configure Nginx

- If you have access, add an Nginx config:
  ```
  server {
      listen 80;
      server_name your-backend-domain.com;
      location /static/ {
          root /home/yourusername/harvestforgood/backend;
      }
      location / {
          include uwsgi_params;
          uwsgi_pass unix:/home/yourusername/harvestforgood/harvestforgood.sock;
      }
  }
  ```
- Otherwise, request Hostinger support to set up Nginx for you.

## 7. Enable HTTPS

- In Hostinger, enable SSL (Let’s Encrypt).
- Force HTTPS redirects in your Nginx config.

## 8. Environment Variables & Security

- Never commit `.env` or secrets to Git.
- Use Hostinger’s dashboard to set environment variables if possible.

## 9. Maintenance & Updates

- To update code:
  ```bash
  ssh yourusername@yourserver
  cd ~/harvestforgood
  git pull
  cd backend
  source venv/bin/activate
  pip install -r requirements.txt
  python manage.py migrate
  uwsgi --reload uwsgi.pid
  ```

## 10. Troubleshooting

- Check logs: `~/harvestforgood/uwsgi.log`
- Use `check_server.py` to verify Django health.
- Use `check_email_config.py` to verify email settings.
- Ensure CORS settings in `core/settings.py` allow your frontend domain.

## 11. Monitoring

- Use Hostinger’s monitoring tools.
- Optionally, integrate Sentry for error tracking.

---

**Summary:**  
This guide is tailored for your Django + PostgreSQL backend on Hostinger, using uWSGI and Nginx. Follow these steps for a secure, production-ready deployment.

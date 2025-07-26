# Harvest For Good - Backend Hosting Guide (Django + PostgreSQL on AWS)

## 1. Prepare Your Django Project

- Ensure your Django project is working locally with PostgreSQL.
- Update `settings.py` for allowed hosts:
  ```python
  ALLOWED_HOSTS = ['.elasticbeanstalk.com']
  ```
- Install `psycopg2` for PostgreSQL:
  ```bash
  pip install psycopg2-binary
  ```

## 2. Push Your Code to GitHub

- Commit your changes:
  ```bash
  git add .
  git commit -m "Prepare for AWS deployment"
  ```
- Push to GitHub:
  ```bash
  git push origin main
  ```

## 3. Create an RDS PostgreSQL Database

- In AWS Console, create an Amazon RDS PostgreSQL instance.
- Note the endpoint, username, password, and database name.

## 4. Deploy Django with Elastic Beanstalk

- Install AWS CLI and EB CLI.
- Initialize Elastic Beanstalk:
  ```bash
  eb init -p python-3.11 harvestforgood-backend
  eb create harvestforgood-env
  ```
- Set environment variables in Elastic Beanstalk (use your `.env.production` values).
- Set up `requirements.txt` and `Procfile`:
  ```
  web: gunicorn core.wsgi:application
  ```
- Deploy:
  ```bash
  eb deploy
  ```

## 5. Configure Django for RDS

- Update your Django settings to use the RDS PostgreSQL connection info.

## 6. Static & Media Files

- Use [Whitenoise](https://whitenoise.evans.io/) for static files.
- For media, use Amazon S3.

## 7. HTTPS & Monitoring

- Elastic Beanstalk provides HTTPS via AWS Certificate Manager.
- Use AWS CloudWatch for logs and monitoring.

## 8. Maintenance

- Deploy updates with `eb deploy`.
- Update environment variables in the AWS Console.

---

**Summary:**  
AWS is robust and scalable for Django + PostgreSQL. Elastic Beanstalk and RDS make deployment easier, but expect more setup and higher costs than platforms like Render or Railway.
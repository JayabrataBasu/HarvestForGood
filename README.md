# Harvest For Good

## Hosting Guide: Step by Step Instructions

This guide explains how to deploy the Harvest For Good project using Vercel for the frontend and Hostinger for the backend.

### 1. Preparing Your Project

#### Frontend Preparation

1. Ensure your environment variables are properly configured

   ```
   # In frontend/.env.production
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   ```

2. Test your frontend build locally

   ```bash
   cd frontend
   npm run build
   npm start
   ```

#### Backend Preparation

1. Create a production settings file or adjust your existing settings

   ```
   # In backend/.env.production
   DEBUG=False
   SECRET_KEY=your_secure_secret_key
   ALLOWED_HOSTS=your-backend-domain.com
   DATABASE_URL=mysql://username:password@host:port/database_name
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

2. Update your requirements.txt

   ```bash
   cd backend
   pip freeze > requirements.txt
   ```

3. Collect static files

   ```bash
   python manage.py collectstatic --noinput
   ```

4. **Create Django Admin Superuser**

   ```bash
   python manage.py createsuperuser
   ```

   This will prompt you to create an admin user with full access to the Django admin panel.

### 2. Deploying Frontend to Vercel

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com) (you can use GitHub to sign up)

2. **Install Vercel CLI** (optional but helpful)

   ```bash
   npm i -g vercel
   ```

3. **Connect Your Repository**
   - Go to the Vercel dashboard
   - Click "Import Project"
   - Select "Import Git Repository"
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your HarvestForGood repository

4. **Configure Project Settings**
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: .next

5. **Set Environment Variables**
   - Add your environment variables from `.env.production`
   - Make sure to include `NEXT_PUBLIC_API_URL` pointing to your Hostinger backend

6. **Deploy**
   - Click "Deploy"
   - Wait for the build process to complete
   - Your frontend will be available at a Vercel-provided URL

7. **Custom Domain** (Optional)
   - In the Vercel dashboard, go to Project Settings > Domains
   - Add your custom domain and follow the instructions to set up DNS

### 3. Deploying Backend to Hostinger

1. **Purchase a Hostinger Plan**
   - Sign up at [hostinger.com](https://hostinger.com)
   - Choose a plan that supports Python applications
   - Premium or Business plans are recommended for Django apps

2. **Create a Database**
   - Log in to your Hostinger control panel
   - Navigate to "Databases" section
   - Create a new MySQL database
   - Note down database name, username, password, host, and port

3. **Set Up SSH Access**
   - In Hostinger control panel, find SSH Access
   - Generate or upload SSH keys
   - Note your server IP and SSH credentials

4. **Upload Your Backend Code**
   - Use SFTP (like FileZilla) or Git to upload your code

   ```bash
   # Using SFTP (after connecting)
   put -r ./backend /home/yourusername/harvestforgood

   # Or using Git
   ssh yourusername@yourserver
   cd ~/
   git clone https://github.com/yourusername/HarvestForGood.git
   cd HarvestForGood/backend
   ```

5. **Set Up Python Environment**

   ```bash
   # SSH into your server
   ssh yourusername@yourserver

   # Navigate to your project directory
   cd ~/harvestforgood/backend

   # Create and activate a virtual environment
   python3 -m venv venv
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt
   
   # Add .env.production file
   nano .env.production
   # Paste your environment variables
   ```

6. **Configure the Database**

   ```bash
   # Run migrations
   python manage.py migrate
   
   # Collect static files for admin
   python manage.py collectstatic --noinput
   
   # Create a superuser (admin) for Django Admin Panel
   python manage.py createsuperuser
   ```

7. **Set Up uWSGI and Nginx**
   - Create a uwsgi.ini file:

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

   - Request Hostinger support to configure Nginx or if you have access:

   ```
   # Example Nginx configuration
   server {
       listen 80;
       server_name your-backend-domain.com;
       
       location = /favicon.ico { access_log off; log_not_found off; }
       
       location /static/ {
           root /home/yourusername/harvestforgood/backend;
       }
       
       location /media/ {
           root /home/yourusername/harvestforgood/backend;
       }
       
       location / {
           include uwsgi_params;
           uwsgi_pass unix:/home/yourusername/harvestforgood/harvestforgood.sock;
       }
   }
   ```

8. **Start uWSGI**

   ```bash
   uwsgi --ini uwsgi.ini
   ```

9. **Set Up Domain in Hostinger**
   - In Hostinger control panel, navigate to Domains
   - Add a domain and point it to your server
   - Configure DNS settings if using a custom domain

10. **Enable HTTPS** (Essential)

- In Hostinger control panel, find SSL/TLS section
- Enable Let's Encrypt certificate for your domain
- Force HTTPS redirects

### 4. Accessing Django Admin Panel

Once your backend is deployed, you can access the full Django admin panel at:

```
https://your-backend-domain.com/admin/
```

**Important Configuration:**
- Set the `FRONTEND_URL` environment variable to your frontend domain (e.g., `https://harvestforgood.vercel.app`)
- This ensures password reset emails link to your frontend instead of the backend

**Features Available:**

1. **User Management**
   - View, edit, and manage all users
   - Set staff and superuser permissions
   - Verify email addresses
   - Manage user roles and permissions

2. **Research Paper Management**
   - Add, edit, and delete research papers
   - Manage authors and keywords
   - Export papers as CSV
   - Bulk operations

3. **Forum Management**
   - Moderate forum posts and comments
   - Pin/unpin important posts
   - Manage forum tags
   - Monitor likes and engagement

4. **Academic Profiles**
   - Verify academic credentials
   - Manage institutional affiliations
   - Review verification documents

5. **Security Monitoring**
   - View failed login attempts
   - Monitor suspicious activities
   - Security dashboard and alerts

**Login Credentials:**
Use the superuser account you created during setup.

### 5. Connecting Frontend and Backend

1. **Update CORS Settings**

   ```python
   # In backend/core/settings.py
   CORS_ALLOWED_ORIGINS = [
       "https://your-frontend-domain.com",
   ]
   
   CSRF_TRUSTED_ORIGINS = [
       "https://your-frontend-domain.com",
   ]
   ```

2. **Update API URL in Frontend**
   - In Vercel dashboard, update the `NEXT_PUBLIC_API_URL` environment variable
   - Redeploy the frontend if necessary

### 6. Troubleshooting

- **Backend Connection Issues**
  - Check Hostinger firewall settings
  - Verify CORS configuration
  - Examine uWSGI and Nginx logs: `/home/yourusername/harvestforgood/uwsgi.log`

- **Frontend API Connection Issues**
  - Verify environment variables are correctly set in Vercel
  - Check browser console for CORS errors
  - Ensure API endpoints use the correct URL format

- **Database Connection Issues**
  - Verify database credentials
  - Check if database server allows external connections
  - Ensure Django settings correctly reference database credentials

- **Django Admin Access Issues**
  - Ensure static files are collected: `python manage.py collectstatic`
  - Check that superuser account is created
  - Verify admin URLs are accessible in Nginx configuration

### 7. Maintenance

- **Backend Updates**

  ```bash
  # SSH into your server
  ssh yourusername@yourserver
  
  # Pull latest code
  cd ~/harvestforgood
  git pull
  
  # Activate environment and update dependencies
  cd backend
  source venv/bin/activate
  pip install -r requirements.txt
  
  # Run migrations if needed
  python manage.py migrate
  
  # Collect static files
  python manage.py collectstatic --noinput
  
  # Restart uWSGI
  uwsgi --reload uwsgi.pid
  ```

- **Frontend Updates**
  - Push changes to your repository
  - Vercel will automatically rebuild and deploy
  - Or manually trigger a redeploy from the Vercel dashboard

### 8. Monitoring

- Set up basic monitoring with Hostinger's tools
- Use Django admin panel for content management
- Monitor security through the admin security dashboard
- Consider adding application monitoring like Sentry
- Regularly check logs for errors

### 9. Admin Panel Access Summary

Your Django admin panel provides complete control over:

- **Users**: Registration, permissions, verification
- **Content**: Research papers, forum posts, comments
- **Moderation**: Pin posts, verify academics, manage tags
- **Security**: Monitor logins, track suspicious activity
- **Data**: Export, import, bulk operations
- **Settings**: Site configuration, email templates

Access URL: `https://your-backend-domain.com/admin/`

With these steps, your Harvest For Good project should be successfully deployed with the frontend on Vercel and the backend on Hostinger, including full Django admin panel access.

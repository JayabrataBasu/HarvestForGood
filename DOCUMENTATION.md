# Harvest For Good - Project Documentation

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Database Configuration](#database-configuration)
- [API Documentation](#api-documentation)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

## Overview

Harvest For Good is a platform designed to connect local farmers with food banks and community organizations to reduce food waste and increase access to fresh produce for those in need. The application facilitates the donation of surplus harvest, coordination of pickups, and tracking of impact metrics.

## Architecture

### Technology Stack

**Frontend:**

- Next.js
- React
- CSS/SCSS for styling
- Axios for API requests

**Backend:**

- Django
- Django REST Framework
- PostgreSQL database
- uWSGI and Nginx for production deployment

### System Architecture

The application follows a client-server architecture:

1. **Frontend (Client)**: Next.js application hosted on Vercel
2. **Backend (Server)**: Django REST API hosted on Hostinger
3. **Database**: MySQL database for persistent storage
4. **Authentication**: JWT-based authentication system

## Installation

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MySQL (v5.7 or higher)
- Git

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/HarvestForGood.git
   cd HarvestForGood/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` file:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd HarvestForGood/backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file:

   ```
   DEBUG=True
   SECRET_KEY=your_development_secret_key
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=mysql://username:password@localhost:3306/harvest_for_good
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

5. Run migrations:

   ```bash
   python manage.py migrate
   ```

6. Create a superuser:

   ```bash
   python manage.py createsuperuser
   ```

7. Run the development server:

   ```bash
   python manage.py runserver
   ```

## Configuration

### Environment Variables

#### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | URL of the backend API | <http://localhost:8000> |

#### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DEBUG | Debug mode flag | True/False |
| SECRET_KEY | Django secret key | random_string_here |
| ALLOWED_HOSTS | List of allowed hosts | localhost,127.0.0.1 |
| DATABASE_URL | Database connection string | mysql://user:pass@host:port/db_name |
| CORS_ALLOWED_ORIGINS | Allowed origins for CORS | <http://localhost:3000> |

### Database Configuration

The application uses MySQL as its database. The connection is configured through the `DATABASE_URL` environment variable in the following format:

```
mysql://username:password@host:port/database_name
```

## API Documentation

### Authentication

The API uses JWT authentication.

**Login:**

```
POST /api/auth/login/
Body: {
  "email": "user@example.com",
  "password": "password"
}
Response: {
  "access": "access_token",
  "refresh": "refresh_token"
}
```

**Refresh Token:**

```
POST /api/auth/refresh/
Body: {
  "refresh": "refresh_token"
}
Response: {
  "access": "new_access_token"
}
```

### User Endpoints

**Get Current User:**

```
GET /api/users/me/
Headers: {
  "Authorization": "Bearer access_token"
}
Response: {
  "id": 1,
  "email": "user@example.com",
  "name": "User Name",
  "user_type": "farmer"
}
```

### Farm Endpoints

**List Farms:**

```
GET /api/farms/
Response: [
  {
    "id": 1,
    "name": "Green Valley Farm",
    "location": "123 Farm Road",
    "description": "Organic produce farm"
  }
]
```

**Get Farm Details:**

```
GET /api/farms/{id}/
Response: {
  "id": 1,
  "name": "Green Valley Farm",
  "location": "123 Farm Road",
  "description": "Organic produce farm",
  "products": ["Tomatoes", "Cucumbers"]
}
```

### Donation Endpoints

**List Donations:**

```
GET /api/donations/
Response: [
  {
    "id": 1,
    "farm": 1,
    "product": "Tomatoes",
    "quantity": 50,
    "unit": "lbs",
    "status": "available"
  }
]
```

**Create Donation:**

```
POST /api/donations/
Headers: {
  "Authorization": "Bearer access_token"
}
Body: {
  "farm": 1,
  "product": "Tomatoes",
  "quantity": 50,
  "unit": "lbs",
  "pickup_window": "2023-09-15T14:00:00Z to 2023-09-15T18:00:00Z"
}
Response: {
  "id": 1,
  "farm": 1,
  "product": "Tomatoes",
  "quantity": 50,
  "unit": "lbs",
  "status": "available"
}
```

## Development Guidelines

### Code Standards

- **Frontend**: Follow Airbnb JavaScript Style Guide
- **Backend**: Follow PEP 8 Style Guide
- Use descriptive variable and function names
- Write unit tests for new features
- Document code using docstrings/JSDoc

### Git Workflow

1. Create a feature branch from `develop`
2. Make changes and test locally
3. Push changes and create a pull request
4. Request code review
5. Merge to `develop` after approval
6. Periodically merge `develop` to `main` for releases

## Deployment

See the [README.md](./README.md) for detailed deployment instructions for both frontend and backend.

## Maintenance

### Regular Tasks

1. **Database Backups**: Schedule daily backups of the production database
2. **Dependency Updates**: Monthly review of npm and pip dependencies for updates and security patches
3. **Performance Monitoring**: Review application performance metrics weekly
4. **Error Logging**: Check error logs daily for issues

### Update Procedures

Follow these steps when updating the application:

1. Test all changes in a staging environment
2. Create a backup of the production database
3. Deploy updates during low-traffic periods
4. Monitor application closely after deployment
5. Have a rollback plan in case of issues

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check that the backend server is running
   - Verify that CORS settings are correctly configured
   - Ensure environment variables are properly set

2. **Database Connection Issues**
   - Verify database credentials are correct
   - Check database server is running and accessible
   - Ensure connection string format is valid

3. **Authentication Problems**
   - Clear browser cookies and localStorage
   - Verify tokens are being properly sent in requests
   - Check token expiration settings

### Support

For additional support:

- Create an issue in the GitHub repository
- Contact the development team at <dev@harvestforgood.example.com>

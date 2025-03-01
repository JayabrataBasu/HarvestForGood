# Setting Up SSL for Local Development

This guide explains how to set up and use SSL for local development in the Harvest For Good project.

## Prerequisites

1. Make sure you have OpenSSL installed:
   - **Windows**: Download from [https://slproweb.com/products/Win32OpenSSL.html](https://slproweb.com/products/Win32OpenSSL.html)
   - **MacOS**: Install via brew: `brew install openssl`
   - **Linux**: Install via package manager: `apt-get install openssl` or equivalent

2. Install django-sslserver:
   ```
   pip install django-sslserver
   ```

3. Ensure `'sslserver'` is in your `INSTALLED_APPS` in settings.py.

## Setting Up SSL Certificates

1. Run the certificate generation script:
   ```
   python generate_ssl_certs.py
   ```
   This will create self-signed SSL certificates in the `backend/certs` directory.

## Running the Server with SSL

1. Run the SSL server:
   ```
   python backend/run_ssl_server.py
   ```
   Or use the Django management command directly:
   ```
   python manage.py runsslserver --certificate=certs/localhost.crt --key=certs/localhost.key 0.0.0.0:8443
   ```

2. Access your site at: https://localhost:8443/

## Handling Browser Security Warnings

Since you're using a self-signed certificate, your browser will show security warnings. This is normal for development environments:

1. In Chrome, click "Advanced" and then "Proceed to localhost (unsafe)".
2. In Firefox, click "Advanced", then "Accept the Risk and Continue".
3. In Edge, click "Details" and then "Go on to the webpage (not recommended)".

## Troubleshooting

### ERR_SSL_PROTOCOL_ERROR

If you see this error:

1. Make sure you're using `https://` in the URL, not `http://`
2. Verify the port number (8443 by default)
3. Ensure the certificates are properly generated
4. Try a different browser
5. Check if any firewall or antivirus is blocking the connection

### Certificate Issues

If the certificates aren't working:

1. Delete the existing certificates in the `backend/certs` directory
2. Run the certificate generation script again
3. Restart the development server

## Production Use

These self-signed certificates are for development purposes only. For production:

1. Use proper SSL certificates from a trusted authority
2. Set proper security settings in settings.py
3. Configure your web server (Nginx, Apache, etc.) to handle SSL

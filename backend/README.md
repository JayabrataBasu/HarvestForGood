# Harvest for Good Backend

## Running the Development Server with HTTPS

The application can be run with HTTPS support in development mode. This is useful for testing features that require secure connections.

### Step 1: Generate SSL Certificates

Run the certificate generation script:

```bash
python generate_ssl_certs.py
```

This will create self-signed certificates in the `certs` directory.

### Step 2: Run the Development Server with SSL

Use our custom management command:

```bash
python manage.py runserver_ssl
```

Or use django-sslserver directly:

```bash
python manage.py runsslserver --certificate=certs/localhost.crt --key=certs/localhost.key 0.0.0.0:8443
```

### Step 3: Access the HTTPS Server

Open your browser and navigate to:
https://localhost:8443/

Note: Since we're using self-signed certificates, your browser will show a security warning. You can proceed by accepting the risk.

## Troubleshooting

If you see the error "You're accessing the development server over HTTPS, but it only supports HTTP":

- Make sure you're using the `runserver_ssl` or `runsslserver` command instead of the standard `runserver`.
- Ensure the certificates were generated correctly in the `certs` directory.

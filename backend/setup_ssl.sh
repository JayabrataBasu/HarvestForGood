#!/bin/bash
# Script to setup SSL for Django development

echo "Setting up SSL for Django development..."

# Create required directories
mkdir -p certs
mkdir -p apps/management/commands

# Create __init__.py files
touch apps/management/__init__.py
touch apps/management/commands/__init__.py

# Generate SSL certificates
echo "Generating SSL certificates..."
python generate_ssl_certs.py

# Install required packages if not already installed
pip install django-sslserver

echo "Checking if SSL configuration is correctly set up..."
python diagnostic_script.py

echo "Done! You can now run the server with SSL support using:"
echo "python manage.py runsslserver --certificate=certs/localhost.crt --key=certs/localhost.key 0.0.0.0:8443"

from django.core.management.base import BaseCommand
import os
import subprocess
from pathlib import Path
from django.conf import settings

class Command(BaseCommand):
    help = 'Generate self-signed SSL certificates for local development'

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        certs_dir = base_dir / 'certs'
        
        # Create certs directory if it doesn't exist
        if not certs_dir.exists():
            certs_dir.mkdir()
            self.stdout.write(self.style.SUCCESS(f"Created directory {certs_dir}"))
        
        cert_file = certs_dir / 'localhost.crt'
        key_file = certs_dir / 'localhost.key'
        
        # Check if certificates already exist
        if cert_file.exists() and key_file.exists():
            self.stdout.write(self.style.NOTICE("SSL certificates already exist."))
            return
        
        # Generate a self-signed certificate
        cmd = [
            'openssl', 'req', '-x509', '-nodes',
            '-days', '365',
            '-newkey', 'rsa:2048',
            '-keyout', str(key_file),
            '-out', str(cert_file),
            '-subj', '/CN=localhost'
        ]
        
        try:
            subprocess.run(cmd, check=True)
            self.stdout.write(self.style.SUCCESS(f"SSL certificates generated successfully at {certs_dir}"))
            self.stdout.write(f"Certificate file: {cert_file}")
            self.stdout.write(f"Key file: {key_file}")
        except subprocess.CalledProcessError:
            self.stdout.write(self.style.ERROR("Failed to generate SSL certificates. Make sure OpenSSL is installed."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))

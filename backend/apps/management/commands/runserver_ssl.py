from django.core.management.commands.runserver import Command as RunserverCommand
import os
from django.conf import settings

class Command(RunserverCommand):
    help = 'Starts a development server with HTTPS support'

    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument(
            '--cert', 
            default=getattr(settings, 'SSL_CERTIFICATE', os.path.join(settings.BASE_DIR, 'certs', 'localhost.crt')),
            help='Path to the SSL certificate file'
        )
        parser.add_argument(
            '--key', 
            default=getattr(settings, 'SSL_KEY', os.path.join(settings.BASE_DIR, 'certs', 'localhost.key')),
            help='Path to the SSL key file'
        )
        parser.add_argument(
            '--addrport',
            default='127.0.0.1:8443',
            help='Port to run the server on'
        )

    def handle(self, *args, **options):
        # Use the sslserver command under the hood
        try:
            from sslserver.management.commands.runsslserver import Command as RunSSLServerCommand
            
            cmd = RunSSLServerCommand()
            if 'addrport' not in options or not options['addrport']:
                options['addrport'] = '127.0.0.1:8443'
                
            # Check if certificates exist
            cert_file = options['cert']
            key_file = options['key']
            
            if not os.path.exists(cert_file) or not os.path.exists(key_file):
                self.stderr.write(self.style.ERROR(f"SSL certificates not found at {cert_file} and {key_file}"))
                self.stderr.write(self.style.NOTICE("Generating certificates..."))
                
                # Try to generate certificates
                try:
                    from django.core.management import call_command
                    call_command('generate_ssl_certs')
                except:
                    # If command fails, run the generation script directly
                    import subprocess
                    subprocess.run(['python', 'generate_ssl_certs.py'])
                
                if not os.path.exists(cert_file) or not os.path.exists(key_file):
                    self.stderr.write(self.style.ERROR("Failed to generate certificates. Run 'python generate_ssl_certs.py' manually."))
                    return
            
            # Run the SSL server
            cmd.handle(*args, **options)
            
            self.stdout.write(
                self.style.SUCCESS(f'HTTPS Development server is running at https://{options["addrport"]}/')
            )
        except ImportError:
            self.stderr.write(self.style.ERROR("django-sslserver is not installed. Run 'pip install django-sslserver'."))

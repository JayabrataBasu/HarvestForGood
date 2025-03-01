"""
Modern SSL Server command compatible with Python 3.10+
This command replaces the deprecated ssl.wrap_socket with SSLContext
"""

import os
import ssl
import sys
from datetime import datetime

from django.core.management.base import CommandError
from django.core.management.commands import runserver
from django.core.servers.basehttp import WSGIServer
from django.contrib.staticfiles.handlers import StaticFilesHandler
from django.conf import settings

class SecureHTTPServer(WSGIServer):
    """WSGI server that uses SSL/TLS"""
    
    def __init__(self, address, handler_cls, certificate, key):
        super().__init__(address, handler_cls)
        
        # Create SSL context with modern API
        self.context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        self.context.load_cert_chain(certfile=certificate, keyfile=key)
        
        # Wrap socket with the SSL context
        self.socket = self.context.wrap_socket(self.socket, server_side=True)

class Command(runserver.Command):
    help = "Run a Django development server over HTTPS (Python 3.10+ compatible)"
    
    def add_arguments(self, parser):
        super().add_arguments(parser)
        parser.add_argument(
            '--certificate',
            dest='certificate',
            help='Path to the certificate file'
        )
        parser.add_argument(
            '--key',
            dest='key',
            help='Path to the key file'
        )

    def get_handler(self, *args, **options):
        """Return the static files serving handler"""
        handler = super().get_handler(*args, **options)
        use_static_handler = options.get('use_static_handler', True)
        insecure_serving = options.get('insecure_serving', False)
        if use_static_handler and (settings.DEBUG or insecure_serving):
            return StaticFilesHandler(handler)
        return handler

    def check_certs(self, key_file, cert_file):
        """Check if certificate files exist"""
        if not os.path.exists(key_file):
            raise CommandError(f"Can't find key at {key_file}")
        if not os.path.exists(cert_file):
            raise CommandError(f"Can't find certificate at {cert_file}")

    def inner_run(self, *args, **options):
        # Get certificates
        if options.get('certificate') and options.get('key'):
            cert_file = options["certificate"]
            key_file = options["key"]
        else:
            # Use default from settings
            cert_file = getattr(settings, "SSL_CERTIFICATE", None)
            key_file = getattr(settings, "SSL_KEY", None)
        
        # Check certificates
        self.check_certs(key_file, cert_file)
        
        # Set up server
        self.addr = self.addr or options.get('addrport', '127.0.0.1')
        self.port = options.get("port") or '8443'
        if self.addr.startswith('['):
            self.addr = self.addr[1:-1]
        
        # Print server info
        print(datetime.now().strftime('%B %d, %Y - %X'))
        print(f'Django version {self.get_version()}, using settings {settings.SETTINGS_MODULE!r}')
        print(f'Starting development server at https://{self.addr}:{self.port}/')
        print(f'Using SSL certificate: {cert_file}')
        print(f'Using SSL key: {key_file}')
        print('Quit the server with CONTROL-C.')

        try:
            handler = self.get_handler(*args, **options)
            server = SecureHTTPServer(
                (self.addr, int(self.port)), 
                self.get_handler(*args, **options).__class__,
                certificate=cert_file, 
                key=key_file
            )
            server.set_app(handler)
            server.serve_forever()
        except Exception as e:
            # Handle errors and provide helpful messages
            print(f"Error starting SSL server: {e}")
            if isinstance(e, OSError) and e.errno == 98:
                print(f"Port {self.port} is already in use. Try a different port.")
            elif "ssl" in str(e).lower():
                print("There might be an issue with your SSL certificate files.")
                print("Make sure they exist and are valid.")
            sys.exit(1)

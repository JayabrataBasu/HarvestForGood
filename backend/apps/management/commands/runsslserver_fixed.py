"""
Run SSL Server with support for modern Python SSL API.
This is a fixed version of django-sslserver's command that works with Python 3.10+
"""

import os
import ssl
import sys
from datetime import datetime

from django.core.management.base import CommandError
from django.core.management.commands import runserver
from django.core.servers.basehttp import WSGIServer
from django.contrib.staticfiles.handlers import StaticFilesHandler

try:
    from django.core.servers.basehttp import WSGIServerException
except ImportError:
    from socket import error as WSGIServerException


class SecureHTTPServer(WSGIServer):
    def __init__(self, address, handler_cls, certificate, key):
        super().__init__(address, handler_cls)
        
        # Create the SSL context with modern API
        self.context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        self.context.load_cert_chain(certfile=certificate, keyfile=key)
        
        # Wrap the socket with the SSL context
        self.socket = self.context.wrap_socket(self.socket, server_side=True)


class Command(runserver.Command):
    help = "Run a Django development server over HTTPS"
    
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
        """
        Return the static files serving handler wrapping the default handler,
        if static files should be served.
        """
        handler = super().get_handler(*args, **options)
        use_static_handler = options.get('use_static_handler', True)
        insecure_serving = options.get('insecure_serving', False)
        if use_static_handler and (settings.DEBUG or insecure_serving):
            return StaticFilesHandler(handler)
        return handler

    def check_certs(self, key_file, cert_file):
        if not os.path.exists(key_file):
            raise CommandError(f"Can't find key at {key_file}")
        if not os.path.exists(cert_file):
            raise CommandError(f"Can't find certificate at {cert_file}")

    def inner_run(self, *args, **options):
        # Get the certificate and private key files
        if options.get('certificate') and options.get('key'):
            cert_file = options["certificate"]
            key_file = options["key"]
        else:
            # Use the default certificate and key paths from settings
            from django.conf import settings
            cert_file = getattr(settings, "SSL_CERTIFICATE", None)
            key_file = getattr(settings, "SSL_KEY", None)
        
        # Check if the certificate and key files exist
        self.check_certs(key_file, cert_file)

        # Set up the HTTPS server
        from django.conf import settings
        from django.utils import translation

        self.addr = self.addr or options.get('addrport')
        if not self.addr:
            self.addr = '127.0.0.1'
        self.port = options.get("port") or '8000'
        if self.addr.startswith('['):
            self.addr = self.addr[1:-1]
        self.use_ipv6 = False
        
        print(datetime.now().strftime('%B %d, %Y - %X'))
        print(f'Django version {self.get_version()}, using settings {settings.SETTINGS_MODULE!r}')
        print(f'Starting development server at https://{self.addr}:{self.port}/')
        print(f'Using SSL certificate: {cert_file}')
        print(f'Using SSL key: {key_file}')
        print('Quit the server with CONTROL-C.')

        # django.core.management.base forces saving translations, but we cannot
        # do this while the server is running, so just disable it
        translation.activate(settings.LANGUAGE_CODE)

        try:
            handler = self.get_handler(*args, **options)
            server = SecureHTTPServer((self.addr, int(self.port)), 
                                     self.get_request_handler_class(is_secure=True),
                                     certificate=cert_file, key=key_file)
            server.set_app(handler)
            server.serve_forever()
        except WSGIServerException as e:
            # Use helpful error messages instead of ugly tracebacks.
            ERRORS = {
                errno.EACCES: "You don't have permission to access that port.",
                errno.EADDRINUSE: "That port is already in use.",
                errno.EADDRNOTAVAIL: "That IP address can't be assigned to.",
            }
            try:
                error_text = ERRORS[e.args[0]]
            except (AttributeError, KeyError):
                error_text = str(e)
            sys.stderr.write("Error: %s" % error_text + '\n')
            # Need to use an OS exit because sys.exit doesn't work in a thread
            os._exit(1)
        except KeyboardInterrupt:
            sys.stdout.write('\nStopping server...\n')


# Add missing imports at the top level to ensure we don't reference them before definition
import errno
from django.conf import settings

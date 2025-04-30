from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Fix Author model migration state without modifying the database structure'

    def handle(self, *args, **options):
        # First check if fields exist in database
        with connection.cursor() as cursor:
            cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'research_author';")
            columns = [row[0] for row in cursor.fetchall()]
            
            self.stdout.write(f"Found columns in research_author table: {columns}")
            
            # Check if the fields exist
            has_affiliation = 'affiliation' in columns
            has_email = 'email' in columns
            
            self.stdout.write(f"Has affiliation: {has_affiliation}")
            self.stdout.write(f"Has email: {has_email}")
            
            if has_affiliation and has_email:
                self.stdout.write(self.style.SUCCESS(
                    "Both fields already exist in the database. "
                    "You can safely mark migration 0002 as applied using: "
                    "python manage.py migrate research 0002 --fake"
                ))
            else:
                self.stdout.write(self.style.ERROR(
                    "Some fields are missing from the database. "
                    "This needs manual intervention."
                ))

import os
import django
from django.db import connection

# Initialize Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def fix_research_migrations():
    """Fix the django_migrations table for research app"""
    with connection.cursor() as cursor:
        # Check if we have any entries for the research app
        cursor.execute("SELECT COUNT(*) FROM django_migrations WHERE app = 'research'")
        count = cursor.fetchone()[0]
        
        if count > 0:
            print(f"Found {count} research migrations in django_migrations table")
            print("Removing existing research migrations from the table...")
            cursor.execute("DELETE FROM django_migrations WHERE app = 'research'")
            print("Existing research migrations removed")
        
        # Add our new migration to the django_migrations table
        print("Adding initial migration to django_migrations table...")
        cursor.execute("""
            INSERT INTO django_migrations (app, name, applied) 
            VALUES ('research', '0001_initial', NOW())
        """)
        print("Initial migration added to django_migrations table")

if __name__ == "__main__":
    print("Running migration fix script...")
    fix_research_migrations()
    print("Done. The research app migrations should now be in sync with the database.")

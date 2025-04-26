import os
import django
from django.db import connection

# Initialize Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def fix_migration_issues():
    """
    Script to fix migration issues with the research app
    """
    # Check if the research_researchpaper table exists
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'research_researchpaper'
            );
        """)
        table_exists = cursor.fetchone()[0]
        
        if table_exists:
            # Check which column exists
            cursor.execute("""
                SELECT 
                    CASE 
                        WHEN EXISTS (
                            SELECT FROM information_schema.columns 
                            WHERE table_name = 'research_researchpaper' 
                            AND column_name = 'publication_date'
                        ) THEN 'publication_date'
                        WHEN EXISTS (
                            SELECT FROM information_schema.columns 
                            WHERE table_name = 'research_researchpaper' 
                            AND column_name = 'publication_year'
                        ) THEN 'publication_year'
                        ELSE 'none'
                    END as column_name;
            """)
            column_name = cursor.fetchone()[0]
            
            if column_name == 'publication_date':
                print("Found 'publication_date' column - this will be renamed to 'publication_year' by migrations")
            elif column_name == 'publication_year':
                print("Found 'publication_year' column - no renaming needed")
            else:
                print("Neither column exists - check your model and migrations")
        else:
            print("The 'research_researchpaper' table doesn't exist yet. Migrations will create it.")

    # Check the Django migration records
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM django_migrations
                WHERE app = 'research'
            );
        """)
        migrations_exist = cursor.fetchone()[0]
        
        if migrations_exist:
            print("\nExisting research migrations in the database:")
            cursor.execute("""
                SELECT name FROM django_migrations
                WHERE app = 'research'
                ORDER BY id;
            """)
            for row in cursor.fetchall():
                print(f"- {row[0]}")
        else:
            print("\nNo research migrations found in the database.")

if __name__ == "__main__":
    print("Running migration cleanup script...")
    fix_migration_issues()
    print("\nDone. Now try these steps:")
    print("1. python manage.py makemigrations research")
    print("2. python manage.py migrate research")

import os
import django
from django.db import connection

# Initialize Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def fix_db_tables():
    """Check and fix research tables in the database"""
    # Check if django_migrations table has research entries
    with connection.cursor() as cursor:
        # Count research migrations
        cursor.execute("SELECT COUNT(*) FROM django_migrations WHERE app = 'research'")
        count = cursor.fetchone()[0]
        
        if count > 0:
            print(f"Found {count} research migrations in the database")
            print("Removing all research migrations from django_migrations table...")
            cursor.execute("DELETE FROM django_migrations WHERE app = 'research'")
            print("Research migrations removed from django_migrations table")
        else:
            print("No research migrations found in django_migrations table")
        
        # Check if research tables exist
        tables = [
            'research_researchpaper',
            'research_author',
            'research_keyword',
            'research_keywordcategory',
            'research_researchpaper_authors',
            'research_researchpaper_keywords'
        ]
        
        print("\nChecking for existing research tables:")
        for table in tables:
            cursor.execute(f"""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = '{table}'
                )
            """)
            exists = cursor.fetchone()[0]
            print(f"- {table}: {'Exists' if exists else 'Does not exist'}")
            
            # If table exists, check for publication_date or publication_year column
            if exists and table == 'research_researchpaper':
                cursor.execute("""
                    SELECT column_name FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper'
                    AND (column_name = 'publication_date' OR column_name = 'publication_year')
                """)
                columns = cursor.fetchall()
                if columns:
                    for col in columns:
                        print(f"  - Found column: {col[0]}")

if __name__ == "__main__":
    print("Running database table check and fix...")
    fix_db_tables()
    print("\nDatabase check complete")

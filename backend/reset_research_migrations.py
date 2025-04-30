import os
import shutil
from pathlib import Path
from django.db import connection
import django

# Initialize Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def reset_research_migrations():
    """Reset all research app migrations"""
    # Define paths
    migration_dir = Path('apps/research/migrations')
    backup_dir = Path('apps/research/migrations_backup_' + 
                      django.utils.timezone.now().strftime('%Y%m%d_%H%M%S'))
    
    # Create backup directory
    backup_dir.mkdir(exist_ok=True, parents=True)
    
    print(f"Created backup directory: {backup_dir}")
    
    # Backup & remove existing migration files (except __init__.py)
    print("Backing up existing migrations...")
    for file in migration_dir.glob('*.py'):
        if file.name != '__init__.py':
            try:
                shutil.copy(file, backup_dir / file.name)
                print(f"  Backed up: {file.name}")
                os.remove(file)
                print(f"  Removed: {file.name}")
            except Exception as e:
                print(f"  Error with {file.name}: {e}")
    
    # Remove entries from django_migrations table
    with connection.cursor() as cursor:
        print("\nRemoving migration records from database...")
        cursor.execute("DELETE FROM django_migrations WHERE app = 'research'")
        print("Migration records removed from database")
    
    print("\nMigration reset complete! Now run:")
    print("1. python manage.py makemigrations research")
    print("2. python manage.py migrate research")

if __name__ == "__main__":
    reset_research_migrations()

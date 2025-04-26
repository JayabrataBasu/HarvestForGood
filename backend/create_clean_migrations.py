import os
import shutil
from pathlib import Path

def clean_migrations():
    """Create clean migrations for the research app"""
    # Define migration directory
    migration_dir = Path('apps/research/migrations')
    
    # Create backup directory
    backup_dir = Path('apps/research/migrations_backup')
    backup_dir.mkdir(exist_ok=True)
    
    # Back up existing migrations except __init__.py
    print("Backing up existing migrations...")
    for file in migration_dir.glob('*.py'):
        if file.name != '__init__.py':
            backup_path = backup_dir / file.name
            try:
                shutil.copy(file, backup_path)
                print(f"Backed up: {file.name}")
                os.remove(file)
                print(f"Removed: {file.name}")
            except Exception as e:
                print(f"Error processing {file.name}: {e}")
    
    print("\nCreating fresh migrations with makemigrations...")
    print("\nMigration cleanup complete. Run the following commands:")
    print("1. python manage.py makemigrations research")
    print("2. python manage.py migrate")

if __name__ == "__main__":
    clean_migrations()

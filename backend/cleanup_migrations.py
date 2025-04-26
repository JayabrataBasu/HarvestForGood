import os
import shutil
from pathlib import Path

def clean_migrations():
    """Clean up research migrations to resolve conflicts"""
    # Define migration directory
    migration_dir = Path('apps/research/migrations')
    
    # Create backup directory
    backup_dir = Path('apps/research/migrations_backup')
    backup_dir.mkdir(exist_ok=True)
    
    # Backup existing migrations except __init__.py
    print("Backing up existing migrations...")
    for file in migration_dir.glob('*.py'):
        if file.name != '__init__.py':
            print(f"Backing up: {file.name}")
            shutil.copy(file, backup_dir / file.name)
    
    # Delete all migration files except __init__.py
    print("\nRemoving conflicting migrations...")
    for file in migration_dir.glob('*.py'):
        if file.name != '__init__.py':
            print(f"Removing: {file.name}")
            os.remove(file)
    
    # Create a fresh initial migration
    print("\nCreating new initial migration...")
    with open(migration_dir / '0001_initial.py', 'w') as f:
        f.write("""from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    
    dependencies = []
    
    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'verbose_name': 'Author',
                'verbose_name_plural': 'Authors',
            },
        ),
        migrations.CreateModel(
            name='KeywordCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('description', models.TextField(blank=True)),
            ],
            options={
                'verbose_name_plural': 'Keyword Categories',
            },
        ),
        migrations.CreateModel(
            name='Keyword',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='keywords', to='research.keywordcategory')),
            ],
            options={
                'verbose_name': 'Keyword',
                'verbose_name_plural': 'Keywords',
            },
        ),
        migrations.CreateModel(
            name='ResearchPaper',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('abstract', models.TextField()),
                ('publication_year', models.IntegerField()),
                ('journal', models.CharField(blank=True, max_length=255)),
                ('doi', models.CharField(blank=True, max_length=100, null=True)),
                ('url', models.URLField(blank=True)),
                ('methodology_type', models.CharField(blank=True, max_length=50)),
                ('citation_count', models.IntegerField(default=0)),
                ('citation_trend', models.CharField(choices=[('increasing', 'Increasing'), ('decreasing', 'Decreasing'), ('stable', 'Stable')], default='stable', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('authors', models.ManyToManyField(related_name='papers', to='research.author')),
                ('keywords', models.ManyToManyField(related_name='papers', to='research.keyword')),
            ],
        ),
    ]
""")
    
    print("\nMigration cleanup complete. Run the following commands:")
    print("1. python manage.py migrate research zero")
    print("2. python manage.py migrate research")

if __name__ == "__main__":
    clean_migrations()

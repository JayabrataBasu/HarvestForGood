from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Check database schema for research_researchpaper table'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = 'research_researchpaper'
                ORDER BY ordinal_position;
            """)
            columns = cursor.fetchall()
            
            self.stdout.write(self.style.SUCCESS("Database schema for research_researchpaper:"))
            for column in columns:
                name, data_type, nullable = column
                self.stdout.write(f"{name}: {data_type} (nullable: {nullable})")
                
            # Check author relationship table
            cursor.execute("""
                SELECT COUNT(*) 
                FROM information_schema.tables 
                WHERE table_name = 'research_researchpaper_authors'
            """)
            if cursor.fetchone()[0] > 0:
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM research_researchpaper_authors
                """)
                count = cursor.fetchone()[0]
                self.stdout.write(f"Author relationships in database: {count}")

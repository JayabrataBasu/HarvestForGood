from django.core.management.base import BaseCommand
from apps.research.models import ResearchPaper, Author
from django.db import connection

class Command(BaseCommand):
    help = 'Fix data issues with publication_year and authors'

    def handle(self, *args, **options):
        # First, check the actual database schema
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'research_researchpaper'
                AND column_name = 'publication_year'
            """)
            column_info = cursor.fetchone()
            
            if column_info:
                column_name, data_type = column_info
                self.stdout.write(f"Database column type: {column_name} is {data_type}")
                
                # If the column is date type but should be varchar
                if data_type == 'date':
                    self.stdout.write(self.style.WARNING(
                        "Converting publication_year from date to varchar..."
                    ))
                    try:
                        cursor.execute("""
                            ALTER TABLE research_researchpaper 
                            ALTER COLUMN publication_year TYPE varchar(10) 
                            USING to_char(publication_year, 'YYYY')
                        """)
                        self.stdout.write(self.style.SUCCESS("Column type changed to varchar"))
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f"Error changing column type: {e}"))
        
        # Now fix papers with missing or incorrect publication years
        papers = ResearchPaper.objects.all()
        self.stdout.write(f"Found {papers.count()} papers")
        
        fixed_count = 0
        for paper in papers:
            self.stdout.write(f"Paper ID: {paper.id}")
            self.stdout.write(f"  Title: {paper.title}")
            self.stdout.write(f"  publication_year: {paper.publication_year}")
            self.stdout.write(f"  Authors: {[a.name for a in paper.authors.all()]}")
            
            # Check if there are any publication year issues
            if paper.publication_year and not isinstance(paper.publication_year, str):
                try:
                    if hasattr(paper.publication_year, 'year'):
                        paper.publication_year = str(paper.publication_year.year)
                    elif isinstance(paper.publication_year, int):
                        paper.publication_year = str(paper.publication_year)
                    else:
                        paper.publication_year = str(paper.publication_year)
                    
                    paper.save(update_fields=['publication_year'])
                    fixed_count += 1
                    self.stdout.write(self.style.SUCCESS(f"  Fixed year to: {paper.publication_year}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  Error fixing: {e}"))
            
            self.stdout.write("---")
            
        self.stdout.write(self.style.SUCCESS(f"Fixed {fixed_count} papers"))

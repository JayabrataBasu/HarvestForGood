from django.core.management.base import BaseCommand
from apps.research.models import ResearchPaper

class Command(BaseCommand):
    help = 'Debug publication_year field to ensure valid data'

    def handle(self, *args, **options):
        papers = ResearchPaper.objects.all()
        
        self.stdout.write(f"Found {papers.count()} papers")
        
        for paper in papers:
            self.stdout.write(f"Paper ID: {paper.id}")
            self.stdout.write(f"  Title: {paper.title}")
            self.stdout.write(f"  publication_year: {paper.publication_year}")
            self.stdout.write(f"  Type: {type(paper.publication_year)}")
            
            # Check if there are any problematic values
            if paper.publication_year and not isinstance(paper.publication_year, (int, str)):
                self.stdout.write(self.style.WARNING(
                    f"  Potential issue - publication_year isn't an int or string: {type(paper.publication_year)}"
                ))
                
                # Try to fix it
                try:
                    if hasattr(paper.publication_year, 'year'):
                        paper.publication_year = paper.publication_year.year
                        paper.save(update_fields=['publication_year'])
                        self.stdout.write(self.style.SUCCESS(f"  Fixed by using .year attribute"))
                    else:
                        self.stdout.write(self.style.ERROR(f"  Couldn't automatically fix"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  Error fixing: {e}"))
            
            self.stdout.write("---")

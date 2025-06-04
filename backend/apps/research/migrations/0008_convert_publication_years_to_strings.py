from django.db import migrations

def convert_dates_to_strings(apps, schema_editor):
    """Ensure all publication_year values are properly stored as strings"""
    ResearchPaper = apps.get_model('research', 'ResearchPaper')
    for paper in ResearchPaper.objects.all():
        # Handle different possible data types
        if paper.publication_year:
            # Convert all types to string
            if hasattr(paper.publication_year, 'year'):
                # It's a date object, extract the year
                paper.publication_year = str(paper.publication_year.year)
            elif isinstance(paper.publication_year, int):
                # It's already an int
                paper.publication_year = str(paper.publication_year)
            elif not isinstance(paper.publication_year, str):
                # Some other type, try to convert it
                try:
                    paper.publication_year = str(paper.publication_year)
                except:
                    # If all else fails, use current year
                    from datetime import datetime
                    paper.publication_year = str(datetime.now().year)
            # Save the paper with the corrected publication_year
            paper.save()

class Migration(migrations.Migration):
    dependencies = [
        ('research', '0006_alter_publication_year'),  # Update dependency
    ]

    operations = [
        migrations.RunPython(convert_dates_to_strings),
    ]

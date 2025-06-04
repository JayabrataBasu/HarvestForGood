from django.db import migrations

def convert_dates_to_strings(apps, schema_editor):
    ResearchPaper = apps.get_model('research', 'ResearchPaper')
    for paper in ResearchPaper.objects.all():
        # Extract year as string if it's a date object
        if hasattr(paper.publication_year, 'year'):
            paper.publication_year = str(paper.publication_year.year)
            paper.save()

def convert_strings_to_dates(apps, schema_editor):
    # This is the reverse migration
    pass

class Migration(migrations.Migration):
    dependencies = [
        ('research', '0006_publication_year_string'),
    ]

    operations = [
        migrations.RunPython(convert_dates_to_strings, convert_strings_to_dates),
    ]

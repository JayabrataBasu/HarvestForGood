from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('research', '0004_fix_author_fields'),
    ]

    operations = [
        # This is an empty migration that serves as a bridge
        # It doesn't modify the database but acts as a dependency for 0006_publication_year_string
    ]

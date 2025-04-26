# Generated manually to fix migration issue

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('research', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='researchpaper',
            old_name='publication_date',
            new_name='publication_year',
        ),
    ]

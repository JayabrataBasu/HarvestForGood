# Replace XXXX with the actual migration number Django created
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('research', '0003_auto_previous_migration'),  # Update this to your actual previous migration
    ]

    operations = [
        # Skip removing url since it doesn't exist
        migrations.AddField(
            model_name='researchpaper',
            name='download_url',
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='researchpaper',
            name='issue',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='researchpaper',
            name='pages',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='researchpaper',
            name='volume',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        # Other operations as needed
    ]

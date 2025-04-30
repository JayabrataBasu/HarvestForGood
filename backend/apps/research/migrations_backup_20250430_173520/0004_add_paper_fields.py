from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        # Find the actual latest migration file in your folder and reference it here
        ('research', '0003_your_actual_last_migration'),  # Update this to match your system
    ]

    operations = [
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
    ]

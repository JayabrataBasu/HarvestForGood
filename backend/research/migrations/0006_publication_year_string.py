from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('research', '0005_auto_20230401_1200'),  # Keep as is for now
    ]

    operations = [
        # Change the publication_year field from date type to string (CharField)
        migrations.AlterField(
            model_name='researchpaper',
            name='publication_year',
            field=models.CharField(max_length=10, verbose_name='Publication Year'),
        ),
    ]

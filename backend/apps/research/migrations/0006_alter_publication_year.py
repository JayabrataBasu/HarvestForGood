from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('research', '0007_auto_20230401_1200'),  # Update to depend on 0007
    ]

    operations = [
        migrations.AlterField(
            model_name='researchpaper',
            name='publication_year',
            field=models.CharField(
                blank=True,
                default='',
                max_length=10,
                verbose_name='Publication Year'
            ),
        ),
        # Add a direct SQL operation to ensure the field is properly converted
        migrations.RunSQL(
            """
            -- Ensure the column type is varchar
            ALTER TABLE research_researchpaper ALTER COLUMN publication_year TYPE varchar(10) USING publication_year::varchar;
            
            -- Set empty string for NULLs
            UPDATE research_researchpaper SET publication_year = '' WHERE publication_year IS NULL;
            """,
            # Reverse SQL (not required but good practice)
            ""
        ),
    ]

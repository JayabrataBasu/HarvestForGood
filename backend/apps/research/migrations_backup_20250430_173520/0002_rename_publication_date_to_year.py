from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('research', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            # Check if publication_date exists and rename it
            """
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' 
                    AND column_name = 'publication_date'
                ) THEN
                    ALTER TABLE research_researchpaper RENAME COLUMN publication_date TO publication_year;
                END IF;
            END $$;
            """,
            # Reverse SQL - rename back if needed
            """
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' 
                    AND column_name = 'publication_year'
                ) THEN
                    ALTER TABLE research_researchpaper RENAME COLUMN publication_year TO publication_date;
                END IF;
            END $$;
            """
        ),
    ]

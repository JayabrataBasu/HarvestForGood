from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('research', '0002_rename_publication_date_to_year'),
    ]

    operations = [
        migrations.RunSQL(
            # SQL to check and run only if needed
            """
            DO $$
            BEGIN
                -- If url column exists but download_url doesn't, rename it
                IF EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' 
                    AND column_name = 'url'
                ) AND NOT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' 
                    AND column_name = 'download_url'
                ) THEN
                    ALTER TABLE research_researchpaper RENAME COLUMN url TO download_url;
                -- If neither column exists, create download_url
                ELSIF NOT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' 
                    AND column_name = 'download_url'
                ) THEN
                    ALTER TABLE research_researchpaper ADD COLUMN download_url VARCHAR(500);
                END IF;
            END $$;
            """,
            # Reverse SQL operation
            """
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' 
                    AND column_name = 'download_url'
                ) AND NOT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' 
                    AND column_name = 'url'
                ) THEN
                    ALTER TABLE research_researchpaper RENAME COLUMN download_url TO url;
                END IF;
            END $$;
            """
        ),
    ]

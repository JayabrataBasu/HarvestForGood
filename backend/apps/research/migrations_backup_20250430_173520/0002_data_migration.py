from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('research', '0001_initial'),
    ]
    
    operations = [
        migrations.RunSQL(
            """
            -- Copy any data from temporary or backup tables
            DO $$
            BEGIN
                -- Handle URL to download_url copy if URL still exists
                IF EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' AND column_name = 'url'
                ) THEN
                    UPDATE research_researchpaper 
                    SET download_url = url
                    WHERE download_url IS NULL;
                END IF;
            END $$;
            """,
            reverse_sql=""
        )
    ]

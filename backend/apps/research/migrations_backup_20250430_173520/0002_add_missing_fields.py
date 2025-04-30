from django.db import migrations, models
import apps.utils.fields

class Migration(migrations.Migration):
    dependencies = [
        ('research', '0001_initial'),  # Make sure this points to your actual initial migration
    ]

    operations = [
        # Add SQL operation to check if fields exist before trying to add them
        migrations.RunSQL(
            """
            DO $$
            BEGIN
                -- Add volume if it doesn't exist
                IF NOT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' AND column_name = 'volume'
                ) THEN
                    ALTER TABLE research_researchpaper ADD COLUMN volume character varying(50) NULL;
                END IF;
                
                -- Add issue if it doesn't exist
                IF NOT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' AND column_name = 'issue'
                ) THEN
                    ALTER TABLE research_researchpaper ADD COLUMN issue character varying(50) NULL;
                END IF;
                
                -- Add pages if it doesn't exist
                IF NOT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' AND column_name = 'pages'
                ) THEN
                    ALTER TABLE research_researchpaper ADD COLUMN pages character varying(50) NULL;
                END IF;
                
                -- Add download_url if it doesn't exist and url does exist
                IF NOT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' AND column_name = 'download_url'
                ) AND EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' AND column_name = 'url'
                ) THEN
                    ALTER TABLE research_researchpaper ADD COLUMN download_url character varying(500) NULL;
                    -- Copy data from url to download_url
                    UPDATE research_researchpaper SET download_url = url;
                END IF;
                
                -- Add download_url if neither url nor download_url exist
                IF NOT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' AND column_name = 'download_url'
                ) AND NOT EXISTS (
                    SELECT FROM information_schema.columns 
                    WHERE table_name = 'research_researchpaper' AND column_name = 'url'
                ) THEN
                    ALTER TABLE research_researchpaper ADD COLUMN download_url character varying(500) NULL;
                END IF;
            END $$;
            """,
            # No reverse SQL needed
            ""
        ),
    ]

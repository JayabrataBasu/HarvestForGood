from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("research", "0013_keyword_created_at_keyword_updated_at"),
    ]

    operations = [
        # Database already has the correct structure, so this is a no-op migration
        migrations.RunPython(
            code=lambda apps, schema_editor: None,
            reverse_code=lambda apps, schema_editor: None,
        ),
    ]

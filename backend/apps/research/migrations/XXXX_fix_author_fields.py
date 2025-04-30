from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('research', '0001_initial'),
    ]

    operations = [
        # This is a no-op migration that just acknowledges that the fields
        # already exist in the database
        migrations.RunPython(
            lambda apps, schema_editor: None,
            lambda apps, schema_editor: None,
        )
    ]

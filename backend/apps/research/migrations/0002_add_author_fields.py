from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('research', '0001_initial'),
    ]

    operations = [
        # Since these fields already exist in the database,
        # we're using a RunPython operation to do nothing
        # This allows us to mark the migration as applied without modifying the DB
        migrations.RunPython(
            code=lambda apps, schema_editor: None,
            reverse_code=lambda apps, schema_editor: None,
        ),
    ]

# Generated by Django 5.1.6 on 2025-06-01 17:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("research", "0012_keyword_created_at_keyword_updated_at"),
    ]

    operations = [
        # We remove the operations that are trying to add fields that already exist
        # migrations.AddField(
        #     model_name="keyword",
        #     name="created_at",
        #     field=models.DateTimeField(blank=True, null=True),
        # ),
        # migrations.AddField(
        #     model_name="keyword",
        #     name="updated_at",
        #     field=models.DateTimeField(blank=True, null=True),
        # ),

        # Instead, use an empty operation to note that this migration runs but doesn't do anything
        migrations.RunPython(
            code=lambda apps, schema_editor: None,
            reverse_code=lambda apps, schema_editor: None,
        ),
    ]

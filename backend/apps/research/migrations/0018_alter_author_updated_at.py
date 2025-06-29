from django.db import migrations


def alter_updated_at_field(apps, schema_editor):
    """Make updated_at field nullable"""
    from django.db import connection
    
    with connection.cursor() as cursor:
        cursor.execute(
            """
            ALTER TABLE research_author 
            ALTER COLUMN updated_at DROP NOT NULL
            """
        )


def reverse_alter_updated_at_field(apps, schema_editor):
    """Reverse the change - make updated_at field non-nullable"""
    from django.db import connection
    
    with connection.cursor() as cursor:
        cursor.execute(
            """
            ALTER TABLE research_author 
            ALTER COLUMN updated_at SET NOT NULL
            """
        )


class Migration(migrations.Migration):

    dependencies = [
        ("research", "0017_alter_author_created_at"),
    ]

    operations = [
        migrations.RunPython(alter_updated_at_field, reverse_alter_updated_at_field),
    ]

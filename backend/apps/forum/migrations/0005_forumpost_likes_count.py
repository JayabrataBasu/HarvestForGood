# Generated by Django 5.1.6 on 2025-04-04 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("forum", "0004_alter_comment_options_alter_forumpost_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="forumpost",
            name="likes_count",
            field=models.IntegerField(default=0),
        ),
    ]

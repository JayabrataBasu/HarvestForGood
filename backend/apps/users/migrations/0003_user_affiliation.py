# Generated by Django 5.1.6 on 2025-07-24 17:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_user_email_verified"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="affiliation",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
    ]

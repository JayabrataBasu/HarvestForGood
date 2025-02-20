# Generated by Django 5.1.6 on 2025-02-16 06:53

import django.db.models.deletion
import taggit.managers
from django.conf import settings
from django.db import migrations, models

def create_default_category(apps, schema_editor):
    Category = apps.get_model('academic', 'Category')
    Category.objects.create(
        id=1,
        name='Default Category',
        description='Default category for academic content'
    )

class Migration(migrations.Migration):

    dependencies = [
        ('academic', '0001_initial'),
        ('taggit', '0006_rename_taggeditem_content_type_object_id_taggit_tagg_content_8fc721_idx'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'categories',
            },
        ),
        migrations.RunPython(create_default_category),  # Add this line here
        migrations.AddField(
            model_name='academic',
            name='tags',
            field=taggit.managers.TaggableManager(help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags'),
        ),
        migrations.AlterModelTable(
            name='academic',
            table=None,
        ),
        migrations.CreateModel(
            name='Attachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='attachments/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('description', models.CharField(blank=True, max_length=255)),
                ('academic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='academic.academic')),
            ],
        ),
        migrations.AddField(
            model_name='academic',
            name='category',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.PROTECT, to='academic.category'),
        ),
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('academic', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='academic.academic')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('academic', 'user')},
            },
        ),
    ]

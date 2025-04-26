from django.db import migrations, models
import apps.utils.fields

class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('affiliation', models.CharField(blank=True, max_length=255)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'unique_together': {('name', 'affiliation')},
            },
        ),
        migrations.CreateModel(
            name='KeywordCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Name of the keyword category', max_length=100, unique=True)),
                ('description', models.TextField(blank=True, help_text='Description of what this category represents')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Keyword Category',
                'verbose_name_plural': 'Keyword Categories',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Keyword',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('category', models.ForeignKey(blank=True, help_text='Category this keyword belongs to', null=True, on_delete=models.deletion.SET_NULL, related_name='keywords', to='research.keywordcategory')),
            ],
        ),
        migrations.CreateModel(
            name='ResearchPaper',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('abstract', models.TextField()),
                ('publication_year', apps.utils.fields.YearField(verbose_name='Year')),
                ('journal', models.CharField(max_length=255)),
                ('download_url', models.URLField(blank=True, max_length=500, null=True)),
                ('doi', models.CharField(blank=True, max_length=100, null=True, unique=True)),
                ('volume', models.CharField(blank=True, max_length=50, null=True)),
                ('issue', models.CharField(blank=True, max_length=50, null=True)),
                ('pages', models.CharField(blank=True, max_length=50, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('slug', models.SlugField(blank=True, max_length=500, null=True, unique=True)),
                ('authors', models.ManyToManyField(related_name='papers', to='research.author')),
                ('keywords', models.ManyToManyField(related_name='papers', to='research.keyword')),
            ],
        ),
    ]

from django.db import migrations

def create_keyword_categories(apps, schema_editor):
    # Get the model
    KeywordCategory = apps.get_model('research', 'KeywordCategory')
    
    # Define default categories
    categories = [
        {
            'name': 'Crops',
            'description': 'Types of crops and growing techniques'
        },
        {
            'name': 'Sustainability',
            'description': 'Environmental sustainability practices'
        },
        {
            'name': 'Technology',
            'description': 'Agricultural technology and innovation'
        },
        {
            'name': 'Economics',
            'description': 'Economic aspects of agriculture'
        },
        {
            'name': 'Social Impact',
            'description': 'Social implications of agricultural practices'
        },
    ]
    
    # Create categories
    for category in categories:
        KeywordCategory.objects.create(**category)

def reverse_create_keyword_categories(apps, schema_editor):
    # Get the model
    KeywordCategory = apps.get_model('research', 'KeywordCategory')
    
    # Delete the categories created in the forward function
    KeywordCategory.objects.filter(
        name__in=['Crops', 'Sustainability', 'Technology', 'Economics', 'Social Impact']
    ).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('research', '0001_initial'),  # Ensure this matches your actual initial migration
    ]

    operations = [
        migrations.RunPython(create_keyword_categories, reverse_create_keyword_categories),
    ]

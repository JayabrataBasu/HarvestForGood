from django.core.management.base import BaseCommand
from apps.research.models import KeywordCategory

class Command(BaseCommand):
    help = 'Add new keyword categories'

    def handle(self, *args, **options):
        categories = [
            {
                'name': 'Conceptual Development',
                'description': 'Keywords related to conceptual frameworks and theoretical development'
            },
            {
                'name': 'Latin America',
                'description': 'Keywords related to Latin American regions, countries, and contexts'
            }
        ]

        created_count = 0
        for category_data in categories:
            category, created = KeywordCategory.objects.get_or_create(
                name=category_data['name'],
                defaults={'description': category_data['description']}
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created category: {category.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Category already exists: {category.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Command completed. {created_count} new categories created.')
        )

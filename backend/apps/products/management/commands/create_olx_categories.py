import logging
import os

import django
from django.core.management.base import BaseCommand


from apps.products.models import Category
from apps.products.utils.olx_categories import categories


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.main')

django.setup()

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Creating OLX categories in the database'

    def handle(self, *args, **options):
        self.create_olx_categories(categories)
        logger.info('Finished creating categories.')

    def create_olx_categories(self, categories_tree: dict, parent: Category = None):
        """Recursively transforms a category tree into a flat dictionary with parent categories specified."""
        for category_id, category_data in categories_tree.items():
            title = category_data.get('title')
            slug = category_data.get('path')
            languages = category_data.get('languages')

            try:
                category, created = Category.objects.get_or_create(
                    title=title,
                    parent=parent,
                    cat_id_olx=category_id,
                    slug=slug,
                    title_uk=languages.get('uk'),
                    title_en=languages.get('en'),
                    title_ru=languages.get('ru'),
                )

                category_data['server_id'] = category.id

                if 'children' in category_data:
                    self.create_olx_categories(category_data['children'], parent=category)

            except Exception as e:
                logger.error(f'Error creating category {title}: {e}')

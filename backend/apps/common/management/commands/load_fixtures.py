import os

import django
from django.core.management import call_command
from django.core.management.base import BaseCommand

from apps.log_config import logger


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.main')

django.setup()


FIXTURE_MAP = [
    {'model': 'products.Category', 'path': 'fixtures/categories.json'},
    {'model': 'locations.Location', 'path': 'fixtures/locations.json'},
    {'model': 'locations.City', 'path': 'fixtures/cities.json'},
    {'model': 'locations.Region', 'path': 'fixtures/regions.json'},
    # {'model': 'locations.Village', 'path': 'fixtures/villages.json'},
    {'model': 'users.User', 'path': 'fixtures/users.json'},
    {'model': 'users.Profile', 'path': 'fixtures/profiles.json'},
    {'model': 'products.Currency', 'path': 'fixtures/currencies.json'},
    {'model': 'products.Product', 'path': 'fixtures/products.json'},
    {'model': 'products.ProductImage', 'path': 'fixtures/images.json'},
    {'model': 'products.Price', 'path': 'fixtures/prices.json'},
]


class Command(BaseCommand):
    help = 'Load fixture data into the database for various models.'

    def handle(self, *args, **options):
        self.load_all_data(FIXTURE_MAP)

    @staticmethod
    def load_data(filename: str) -> None:
        """Loads data from the specified fixture file."""
        call_command('loaddata', filename)

    @classmethod
    def load_all_data(cls, fixture_map: list[dict]) -> None:
        """Loads all model data from the corresponding fixture files."""
        for fixture in fixture_map:
            model = fixture['model']
            cls.load_data(fixture['path'])
            logger.info(f'Fixture for {model.split('.')[1]} was loaded from {fixture['path']}.')

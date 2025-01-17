import os

import django
from django.core.management.base import BaseCommand

from apps.log_config import logger
from apps.products.models import Currency
from apps.products.utils import CurrencyEnum


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings.main')

django.setup()


class Command(BaseCommand):
    help = 'Create default currencies in the database'

    def handle(self, *args, **options):
        self.create_default_currencies()

    @staticmethod
    def create_default_currencies():
        for currency in CurrencyEnum:
            currency_data = currency.value
            Currency.objects.get_or_create(
                code=currency_data['code'],
                defaults={
                    'symbol': currency_data['symbol'],
                    'name': currency_data['name'],
                },
            )
        logger.info('Default currencies created')

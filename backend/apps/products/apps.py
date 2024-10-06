from django.apps import AppConfig
from django.db.models.signals import post_migrate
from django.utils.translation import gettext_lazy as _

from apps.products.utils import DEFAULT_CURRENCIES


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'
    verbose_name = _('Products')

    def ready(self):
        import apps.products.translation  # noqa: F401
        from apps.products.models import Currency  # noqa: F401

        def create_default_currencies(sender, **kwargs):
            for currency_data in DEFAULT_CURRENCIES:
                Currency.objects.get_or_create(
                    code=currency_data['code'],
                    defaults={
                        'symbol': currency_data['symbol'],
                        'name': currency_data['name'],
                    },
                )

        post_migrate.connect(create_default_currencies, sender=self)

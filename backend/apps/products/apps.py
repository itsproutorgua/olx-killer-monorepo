from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'
    verbose_name = _('Products')

    def ready(self):
        import apps.products.signals  # noqa: F401
        import apps.products.search.documents
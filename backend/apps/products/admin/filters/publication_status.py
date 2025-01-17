from django.contrib.admin import SimpleListFilter
from django.utils.translation import gettext_lazy as _

from apps.products.models import Product


class ProductPublicationFilter(SimpleListFilter):
    title = _('Publication Status')
    parameter_name = 'publication_status'

    def lookups(self, request, model_admin):
        return Product.PublicationStatus.choices

    def queryset(self, request, queryset):
        if self.value() in tuple(dict(Product.PublicationStatus.choices).keys()):
            return queryset.filter(publication_status=self.value())

        return queryset

from django.contrib.admin import SimpleListFilter
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.products.models import Product


# TODO придумать логику для использования
class PopularSellerFilter(SimpleListFilter):
    title = _('Popular sellers')
    parameter_name = 'popular_seller'

    def lookups(self, request, model_admin):
        return [('top', _('Top-10 sellers'))]

    def queryset(self, request, queryset):
        match self.value():
            case 'top':
                return queryset.filter(
                    seller__in=Product.objects.values('seller')
                    .annotate(product_count=models.Count('id'))
                    .order_by('-product_count')
                    .values_list('seller', flat=True)[:10]
                )

        return queryset

from django.contrib import admin
from django.db.models import Count
from django.utils.translation import gettext_lazy as _

from apps.products.models import Category


class PopularCategoryFilter(admin.SimpleListFilter):
    POPULAR_CATEGORY_THRESHOLD = 100
    LIMIT = 21

    title = _('Popular Categories')
    parameter_name = 'popular_category'

    def lookups(self, request, model_admin):
        popular_categories = (
            Category.objects.annotate(count_products=Count('products'))
            .filter(count_products__gte=self.POPULAR_CATEGORY_THRESHOLD)
            .order_by('-count_products')[: self.LIMIT]
        )

        return [(cat.id, cat.title) for cat in popular_categories]

    def queryset(self, request, queryset):
        if self.value():
            field = ('category_id', 'id')['category' in request.path]
            return queryset.filter(**{field: self.value()})
        return queryset

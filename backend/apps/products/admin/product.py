from django.contrib import admin
from django.db.models import Q
from django.utils.translation import get_language

from apps.products.admin.filters import PopularCategoryFilter
from apps.products.admin.inlines import PriceInline
from apps.products.admin.inlines import ProductImageInline
from apps.products.admin.inlines import ProductVideoInline
from apps.products.models.product import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'seller', 'category', 'views')
    search_fields = ('title',)
    list_filter = (PopularCategoryFilter,)
    list_display_links = ('id', 'title')
    ordering = ('-views',)
    inlines = [PriceInline, ProductImageInline, ProductVideoInline]
    show_full_result_count = False

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('category', 'seller')

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)

        if search_term and not queryset:
            # поиск по категориям и их родителям на текущем языке
            current_language = get_language()
            title_field = f'title_{current_language}'

            search_term = search_term.strip()
            q1 = Q(**{f'category__{title_field}__icontains': search_term})
            q2 = Q(**{f'category__parent__{title_field}__icontains': search_term})
            q3 = Q(**{f'category__parent__parent__{title_field}__icontains': search_term})
            queryset = Product.objects.filter(q1 | q2 | q3).select_related('category', 'seller').order_by('updated_at')

        return queryset, use_distinct

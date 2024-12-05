from django.contrib import admin
from django.db.models import Q
from django.utils.translation import get_language
from django.utils.translation import gettext_lazy as _
from simple_history.admin import SimpleHistoryAdmin

from apps.products.admin.filters import PopularCategoryFilter
from apps.products.admin.inlines import PriceInline
from apps.products.admin.inlines import ProductImageInline
from apps.products.admin.inlines import ProductVideoInline
from apps.products.models.product import Product


@admin.register(Product)
class ProductAdmin(SimpleHistoryAdmin):
    list_display = ('title', 'seller', 'category', 'views', 'active', 'status')
    readonly_fields = ('id', 'created_at', 'updated_at', 'seller', 'slug', 'prod_olx_id', 'views')
    list_display_links = ('title',)
    autocomplete_fields = ['category']
    search_fields = ('title',)
    ordering = ('-created_at',)
    list_filter = (PopularCategoryFilter,)
    inlines = [PriceInline, ProductImageInline, ProductVideoInline]
    show_full_result_count = False

    fieldsets = (
        (
            _('General'),
            {
                'fields': (
                    'title',
                    'status',
                    'description',
                    'category',
                    'params',
                    'seller',
                    'views',
                    'active',
                    'id',
                    'slug',
                    'created_at',
                    'updated_at',
                    'prod_olx_id',
                )
            },
        ),
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('category', 'seller')

    def get_search_results(self, request, queryset, search_term):
        queryset, use_distinct = super().get_search_results(request, queryset, search_term)

        if search_term and not queryset:
            current_language = get_language()
            title_field = f'title_{current_language}'

            search_term = search_term.strip()
            q1 = Q(**{f'category__{title_field}__icontains': search_term})
            queryset = Product.objects.filter(q1)

        return queryset, use_distinct

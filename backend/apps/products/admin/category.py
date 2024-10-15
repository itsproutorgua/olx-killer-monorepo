from django.contrib import admin
from django.db.models import Count
from modeltranslation.admin import TranslationAdmin

from apps.products.admin.filters import PopularCategoryFilter
from apps.products.models import Category


@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    list_display = ('id', 'title', 'parent', 'views', 'product_count', 'updated_at', 'created_at')
    list_display_links = ('id', 'title')
    readonly_fields = (
        'views',
        'slug',
        'path',
        'cat_id_olx',
        'created_at',
        'updated_at',
    )
    autocomplete_fields = ['parent']
    search_fields = ('title', 'parent__title')
    list_filter = (PopularCategoryFilter,)

    show_full_result_count = False

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(product_count=Count('products'))
        return queryset.select_related('parent').prefetch_related('products').order_by('-product_count')

    @admin.display(description='Количество продуктов', ordering='product_count')
    def product_count(self, obj):
        return obj.product_count

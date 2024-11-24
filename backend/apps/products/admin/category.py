from django.contrib import admin
from django.db.models import Count
from django.utils.translation import gettext_lazy as _
from modeltranslation.admin import TranslationAdmin
from simple_history.admin import SimpleHistoryAdmin

from apps.products.admin.filters import PopularCategoryFilter
from apps.products.models import Category


@admin.register(Category)
class CategoryAdmin(TranslationAdmin, SimpleHistoryAdmin):
    list_display = ('title', 'parent', 'views', 'products_count', 'updated_at', 'created_at')
    list_display_links = ('title',)
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
        queryset = queryset.annotate(products_count=Count('products'))
        return queryset.select_related('parent').prefetch_related('products').order_by('-products_count')

    @admin.display(description=_('Number of Products'), ordering='products_count')
    def products_count(self, obj):
        return obj.products_count

from django.contrib import admin
from modeltranslation.admin import TranslationAdmin

from apps.products.models import Category


@admin.register(Category)
class CategoryAdmin(TranslationAdmin):
    list_display = ('title', 'parent', 'updated_at', 'created_at')
    readonly_fields = ('created_at', 'updated_at')
    search_fields = ('title', 'parent__title')
    list_filter = ('title',)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('parent')

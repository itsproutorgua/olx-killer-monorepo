from django.contrib import admin

from apps.products.admin.inlines import ProductImageInline
from apps.products.models.product import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    show_full_result_count = False

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('category', 'seller')

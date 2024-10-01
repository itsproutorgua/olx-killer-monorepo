from django.contrib import admin

from apps.products.models import ProductImage


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    show_full_result_count = False

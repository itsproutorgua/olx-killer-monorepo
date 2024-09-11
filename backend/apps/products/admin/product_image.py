from django.contrib import admin

from apps.products.models import ProductImage


# fmt: off
@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    ...
# fmt: on

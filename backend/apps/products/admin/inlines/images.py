from django.contrib import admin

from apps.products.models import ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

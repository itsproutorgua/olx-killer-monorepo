from django.contrib import admin

from apps.products.models import ProductVideo


class ProductVideoInline(admin.TabularInline):
    model = ProductVideo
    extra = 1
    max_num = 1

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('product').distinct()

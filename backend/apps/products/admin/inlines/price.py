from django.contrib import admin

from apps.products.models import Price


class PriceInline(admin.TabularInline):
    model = Price
    extra = 1

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('product', 'currency')

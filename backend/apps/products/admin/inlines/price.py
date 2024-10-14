from django.contrib import admin

from apps.products.models import Price


class PriceInline(admin.TabularInline):
    model = Price
    extra = 0
    fields = ('amount', 'currency', 'updated_at')
    readonly_fields = ('updated_at',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('product', 'currency')

from django.contrib import admin

from apps.products.models import Currency


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'symbol')
    fields = ('code', 'name', 'symbol', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    show_full_result_count = False

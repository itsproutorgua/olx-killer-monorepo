from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from apps.products.models import Currency


@admin.register(Currency)
class CurrencyAdmin(SimpleHistoryAdmin):
    list_display = ('code', 'name', 'symbol')
    fields = ('code', 'name', 'symbol', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    show_full_result_count = False

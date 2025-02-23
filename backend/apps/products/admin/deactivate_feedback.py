from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from apps.products.models.deactivate_feedback import ProductDeactivationFeedback


@admin.register(ProductDeactivationFeedback)
class ProductDeactivationFeedbackAdmin(SimpleHistoryAdmin):
    list_display = ('product', 'answer', 'created_at', 'updated_at')
    readonly_fields = ('product', 'created_at', 'updated_at')
    list_display_links = ('product',)
    list_editable = ('answer',)
    search_fields = ('product__title', 'product__seller__email')
    list_filter = ('answer',)
    ordering = ('-created_at',)
    show_full_result_count = False

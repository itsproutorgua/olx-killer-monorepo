from django.contrib import admin

from apps.products.models.deactivate_feedback import ProductDeactivationFeedback


class ProductDeactivationFeedbackInline(admin.TabularInline):
    model = ProductDeactivationFeedback
    extra = 0
    max_num = 1
    readonly_fields = ('created_at', 'updated_at')

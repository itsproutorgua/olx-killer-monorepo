from django.contrib import admin

from apps.products.models.filters.filter import Filter


@admin.register(Filter)
class FilterAdmin(admin.ModelAdmin):
    search_fields = ("name", "label")

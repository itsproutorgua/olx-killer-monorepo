from django.contrib import admin

from apps.products.models.filters.filter_value import FilterValue


@admin.register(FilterValue)
class FilterValueAdmin(admin.ModelAdmin):
    show_full_result_count = False

from django.contrib import admin

from apps.products.models.filters.filter_value import FilterValue


# fmt: off
@admin.register(FilterValue)
class FilterValueAdmin(admin.ModelAdmin):
    ...
# fmt: on

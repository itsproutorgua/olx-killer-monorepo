from django.contrib import admin
from django.utils.translation import get_language

from apps.locations.models import City


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'region')
    search_fields = ['name']
    show_full_result_count = False

    def get_search_fields(self, request):
        language_code = get_language() or 'uk'
        return [f'name_{language_code}']

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('region')
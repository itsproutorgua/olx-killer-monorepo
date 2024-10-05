from django.contrib import admin
from django.utils.translation import get_language

from apps.locations.models import City


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'latitude', 'longitude')

    def get_search_fields(self, request):
        language_code = get_language() or 'uk'
        return [f'name_{language_code}']

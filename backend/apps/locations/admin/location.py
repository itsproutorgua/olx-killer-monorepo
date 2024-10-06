from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from apps.locations.models import Location


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('get_location_name', 'location_type', 'get_region', 'latitude', 'longitude')
    search_fields = ['city__name', 'village__name']
    show_full_result_count = False

    @admin.display(description=_('Location'))
    def get_location_name(self, obj):
        """Return the name of the city or village based on location_type."""
        if obj.location_type == 'city':
            return obj.city.name if obj.city else '-'
        elif obj.location_type == 'village':
            return obj.village.name if obj.village else '-'
        return '-'

    @admin.display(description=_('Region'))
    def get_region(self, obj):
        """Return the region associated with the location."""
        if obj.location_type == 'city':
            return obj.city.region
        return obj.village.region

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('city', 'village', 'city__region')

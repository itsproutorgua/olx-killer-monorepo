from django.contrib import admin

from apps.locations.models import Region


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at', 'updated_at')
    show_full_result_count = False

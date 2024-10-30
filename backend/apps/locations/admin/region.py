from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from apps.locations.models import Region


@admin.register(Region)
class RegionAdmin(SimpleHistoryAdmin):
    list_display = ('name', 'slug', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    show_full_result_count = False

from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from apps.favorites.models import Favorite


@admin.register(Favorite)
class FavoritesAdmin(SimpleHistoryAdmin):
    list_display = ('user', 'product', 'created_at')
    fields = ('pk', 'user', 'product', 'created_at')
    readonly_fields = ('pk', 'user', 'product', 'created_at')
    show_full_result_count = False

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('user', 'product')

    def has_add_permission(self, request):
        return False

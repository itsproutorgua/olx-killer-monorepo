from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from simple_history.admin import SimpleHistoryAdmin

from apps.users.models import Profile


@admin.register(Profile)
class ProfileAdmin(SimpleHistoryAdmin):
    list_display = ('user_email', 'created_at', 'updated_at')
    list_display_links = ('user_email',)
    search_fields = ('user__email',)
    readonly_fields = ('user', 'user_olx_id', 'is_fake_user', 'created_at', 'updated_at')
    autocomplete_fields = ('location',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user').order_by('-created_at')

    def has_add_permission(self, request):
        return False

    @admin.display(description=_('User Email'), ordering='user__email')
    def user_email(self, obj):
        return obj.user.email

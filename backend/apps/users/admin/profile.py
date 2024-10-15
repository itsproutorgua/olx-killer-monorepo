from django.contrib import admin

from apps.users.models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user__email', 'created_at', 'updated_at')
    list_display_links = (
        'id',
        'user__email',
    )
    search_fields = ('user__email',)
    readonly_fields = ('user', 'user_olx_id', 'is_fake_user', 'created_at', 'updated_at')
    autocomplete_fields = ('location',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user').order_by('user__email')

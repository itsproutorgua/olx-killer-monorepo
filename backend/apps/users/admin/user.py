from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.core.exceptions import ValidationError
from django.urls import reverse
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _


User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {"fields": ('profile_link', "username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "usable_password", "password1", "password2"),
            },
        ),
    )
    list_display = ('email', 'profile_link', 'is_email_verified', 'date_joined')
    readonly_fields = ('profile_link', 'last_login', 'date_joined')
    list_display_links = ('email',)
    show_full_result_count = False

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('profile').order_by('-date_joined')

    @admin.display(description=_('Profile link'))
    def profile_link(self, obj):
        if hasattr(obj, 'profile'):
            profile_link_text = _('View Profile')
            profile_url = reverse('admin:users_profile_change', args=[obj.profile.id])
            profile_link_html = f'<a href="{profile_url}">{profile_link_text}</a>'
            return format_html(profile_link_html)
        return '-'

    def save_model(self, request, obj, form, change):
        password1 = form.cleaned_data.get('password1')
        password2 = form.cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            raise ValidationError(_('Passwords do not match.'))

        if password1 and password1 != obj.password:
            obj.set_password(password1)

        super().save_model(request, obj, form, change)

from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        'email',
        'is_email_verified',
        'is_staff',
        'is_superuser',
        'is_active',
        'date_joined',
    )
    list_display_links = ('email',)

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'email')}),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'is_email_verified',
                    'groups',
                    'user_permissions',
                ),
            },
        ),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    show_full_result_count = False
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': (
                    'email',
                    'usable_password',
                    'password1',
                    'password2',
                    'is_email_verified',
                    'is_staff',
                ),
            },
        ),
    )

    def save_model(self, request, obj, form, change):
        password1 = form.cleaned_data.get('password1')
        password2 = form.cleaned_data.get('password2')

        if password1 and password2 and password1 != password2:
            raise ValidationError(_('Passwords do not match.'))

        if password1 and password1 != obj.password:
            obj.set_password(password1)

        super().save_model(request, obj, form, change)

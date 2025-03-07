from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import HistoricalModel
from apps.common.models import TimestampMixin
from apps.locations.models import Location


class Profile(TimestampMixin, HistoricalModel, models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE, related_name='profile', verbose_name=_('User'))
    picture = models.ImageField(
        _('profile picture'),
        upload_to='user_pictures/%Y/%m/%d',
        blank=True,
        null=True,
        max_length=255,
        help_text=_('Upload a profile picture.'),
    )
    location = models.ForeignKey(
        to=Location,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='users',
        verbose_name=_('Location'),
        help_text=_("This field allows you to specify the user's city and region."),
    )
    auth_providers = models.JSONField(
        _('Authentication Providers'),
        blank=True,
        null=True,
        default=dict,
        help_text=_('Specifies the authentication providers linked to the user account.'),
    )
    phone_numbers = models.JSONField(
        _('Phone numbers'), default=list, blank=True, null=True, help_text=_('You can add multiple phone numbers.')
    )
    is_fake_user = models.BooleanField('fake user', default=False)
    user_olx_id = models.IntegerField('USER OLX ID', blank=True, null=True)

    def __str__(self):
        return str(f'Profile for {self.user}')

    class Meta:
        db_table = 'user_profile'
        verbose_name = _('Profile')
        verbose_name_plural = _('Profiles')

    def add_provider(self, provider_name: str, provider_id: str) -> None:
        self.auth_providers[provider_name] = provider_id
        self.save()

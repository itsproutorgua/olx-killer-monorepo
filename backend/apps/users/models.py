from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from apps.locations.models import Location
from apps.users.managers import UserManager


def get_default_location():
    return {'region': '', 'city': ''}


class User(PermissionsMixin, AbstractBaseUser):
    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        _('username'),
        max_length=150,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
    )
    first_name = models.CharField(
        _('first name'),
        max_length=150,
        help_text=_('Required. 150 characters or fewer.'),
        blank=True,
        null=True,
    )
    last_name = models.CharField(
        _('last name'),
        max_length=150,
        help_text=_('Required. 150 characters or fewer.'),
        blank=True,
        null=True,
    )
    email = models.EmailField(_('email address'), unique=True)
    is_email_verified = models.BooleanField(
        _('email confirm'),
        default=False,
        help_text=_('Indicates whether the user has verified their email address.'),
    )
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. Unselect this instead of deleting accounts.'
        ),
    )
    picture = models.ImageField(
        _('profile picture'),
        upload_to='user_pictures/',
        blank=True,
        null=True,
        help_text=_('Upload a profile picture.'),
    )
    location = models.ForeignKey(
        to=Location,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='users',
        verbose_name=_('Location'),
        help_text=_('This field allows you to specify the user\'s city and region.'),
    )
    phone_numbers = models.JSONField(
        _('Phone numbers'), default=list, blank=True, null=True, help_text=_('You can add multiple phone numbers.')
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    is_fake_user = models.BooleanField(_('fake user'), default=False)
    user_olx_id = models.IntegerField('USER OLX ID', blank=True, null=True)

    objects = UserManager()

    class Meta:
        db_table = 'user'
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

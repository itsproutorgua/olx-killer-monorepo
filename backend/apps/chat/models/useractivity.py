from apps.common.models.time_stamp import TimestampMixin
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _


User = get_user_model()


class UserActivity(TimestampMixin, models.Model):
    class Status(models.TextChoices):
        ONLINE = 'online', _('Online')
        OFFLINE = 'offline', _('Offline')

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='activity', verbose_name=_('User'))
    last_seen = models.DateTimeField(auto_now=True, verbose_name=_('Last Seen'))
    status = models.CharField(_('Status'), max_length=10, choices=Status.choices, default=Status.OFFLINE)

    def __str__(self):
        return f'{self.user} - {"Online" if self.status == "online" else "Offline"}'

    class Meta:
        db_table = 'user_activity'
        app_label = 'chat'
        verbose_name = _('User Activity')
        verbose_name_plural = _('User Activity')

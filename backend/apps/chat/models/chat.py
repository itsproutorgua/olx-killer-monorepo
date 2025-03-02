from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import HistoricalModel
from apps.common.models.time_stamp import TimestampMixin


User = get_user_model()


class ChatRoom(TimestampMixin, HistoricalModel, models.Model):
    first_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='first_user', verbose_name=_('First User')
    )
    second_user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='second_user', verbose_name=_('Second User')
    )

    def __str__(self):
        return ' / '.join([str(self.first_user), str(self.second_user)])

    def get_recipient(self, user):
        if user == self.first_user:
            return self.second_user
        return self.first_user

    class Meta:
        db_table = 'chatrooms'
        app_label = 'chat'
        constraints = [models.UniqueConstraint(fields=['first_user', 'second_user'], name='unique_together')]

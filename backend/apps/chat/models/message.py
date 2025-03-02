from django.contrib.auth import get_user_model
from django.db import models
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _

from apps.chat.models.chat import ChatRoom
from apps.common.models import HistoricalModel
from apps.common.models.time_stamp import TimestampMixin


User = get_user_model()


class Message(TimestampMixin, HistoricalModel, models.Model):
    class Status(models.TextChoices):
        SENT = 'sent', _('Sent')
        DELIVERED = 'delivered', _('Delivered')
        READ = 'read', _('Read')

    chat_room = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name='messages', verbose_name=_('Chat Room')
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender_messages', verbose_name=_('Sender'))
    text = models.TextField(verbose_name=_('Text'))
    status = models.CharField(_('Status'), max_length=20, choices=Status.choices, default=Status.SENT)

    def __str__(self):
        return f'{self.sender}'

    def make_as_delivered(self):
        if self.status == self.Status.SENT:
            self.status = self.Status.DELIVERED
            self.save(update_fields=['status'])
            self.updated_at = now()

    def make_as_read(self):
        if self.status == self.Status.DELIVERED:
            self.status = self.Status.READ
            self.save(update_fields=['status'])
            self.updated_at = now()

    class Meta:
        db_table = 'messages'
        app_label = 'chat'
        verbose_name = _('Message')
        verbose_name_plural = _('Messages')

from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from ...common.models.time_stamp import TimestampMixin
from .chat import ChatRoom


User = get_user_model()


class Message(TimestampMixin, models.Model):
    chat_room = models.ForeignKey(
        ChatRoom, on_delete=models.CASCADE, related_name='messages', verbose_name=_('Chat Room')
    )
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender_messages', verbose_name=_('Sender'))
    text = models.TextField()

    def __str__(self):
        return f'{self.sender}'

    class Meta:
        db_table = 'messages'
        verbose_name = _('Message')
        verbose_name_plural = _('Messages')

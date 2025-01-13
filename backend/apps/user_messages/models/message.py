from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import HistoricalModel
from apps.common.models import TimestampMixin


User = get_user_model()


class Message(TimestampMixin, HistoricalModel, models.Model):
    subject = models.CharField(_('Message subject'), max_length=255, blank=True, null=True)
    body = models.TextField(_('Message'))
    is_read = models.BooleanField(_('Is the message read'), default=False)
    sender = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name='sent_messages',
        verbose_name=_('The sender of the message'),
    )
    recipient = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name='received_messages',
        verbose_name=_('The recipient of the message'),
    )
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='replies', null=True, blank=True)

    def __str__(self):
        return f'Message {self.id}'

    def get_conversation(self):
        """Return the history of the conversation this message belongs to."""
        parent_message = self
        while parent_message.parent:
            parent_message = parent_message.parent

        return (
            Message.objects.filter(models.Q(id=parent_message.id) | models.Q(parent=parent_message))
            .order_by('updated_at')
            .select_related('sender', 'recipient')
        )

    class Meta:
        db_table = 'user_messages'
        verbose_name = _('Message')
        verbose_name_plural = _('Messages')
        indexes = [
            models.Index(fields=['sender']),
            models.Index(fields=['recipient']),
            models.Index(fields=['parent']),
            models.Index(fields=['updated_at']),
        ]

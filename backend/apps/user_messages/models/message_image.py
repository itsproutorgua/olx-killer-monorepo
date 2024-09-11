from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimestampMixin
from apps.user_messages.models.message import Message


class MessageImage(TimestampMixin, models.Model):
    message = models.ForeignKey(
        Message, related_name="message_images", on_delete=models.CASCADE
    )
    image = models.ImageField(
        _("Image"), upload_to="messages/%Y/%m/%d", null=True, blank=True
    )

    def __str__(self):
        return f"Image for message {self.message.id}"

    class Meta:
        db_table = "message_images"
        verbose_name = _("Message Image")
        verbose_name_plural = _("Message Images")

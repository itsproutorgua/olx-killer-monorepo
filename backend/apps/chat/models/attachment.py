import mimetypes

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from PIL import Image as PILImage

from apps.chat.models.message import Message


class Attachment(models.Model):
    MAX_FILE_SIZE_MB = settings.MAX_IMAGE_FILE_SIZE_MB
    ALLOWED_MIME_TYPES = settings.ALLOWED_IMAGE_MIME_TYPES

    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(
        _('Attachment'),
        upload_to='chat_attachments/images/%Y/%m/%d',
        null=True,
        blank=True,
        help_text=_('Allowed formats: %s') % ', '.join(ALLOWED_MIME_TYPES),
    )
    file_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    content_type = models.CharField(max_length=100)

    class Meta:
        ordering = ['message__created_at']
        verbose_name = _('Attachment')
        verbose_name_plural = _('Attachments')

    def __str__(self):
        return f'Attachment {self.file_name} for Message {self.message_id}'

    def clean(self):
        """Validate file type, size, and integrity (for images)."""
        super().clean()
        if self.file:
            try:
                mime_type, _ = mimetypes.guess_type(self.file_name) or (self.content_type, None)
                if mime_type not in self.ALLOWED_MIME_TYPES:
                    raise ValidationError(_('Invalid file type. Allowed: %s') % ', '.join(self.ALLOWED_MIME_TYPES))

                # Validate image files
                if mime_type in settings.ALLOWED_IMAGE_MIME_TYPES:
                    with PILImage.open(self.file) as img:
                        img.verify()

                if self.file.size > self.MAX_FILE_SIZE_MB * 1024 * 1024:
                    raise ValidationError(_('File size exceeds %sMB') % self.MAX_FILE_SIZE_MB)

                # Check attachment count per message
                if self.message_id:
                    existing_count = Attachment.objects.filter(message_id=self.message_id).count()
                    if existing_count >= settings.MAX_COUNT_ATTACHMENTS:
                        raise ValidationError(_('Maximum %s attachments per message') % settings.MAX_COUNT_ATTACHMENTS)

            except Exception as e:
                raise ValidationError(_('Invalid file: %s') % str(e))

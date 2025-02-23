import mimetypes

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common import errors
from apps.common.models import HistoricalModel


class ProductVideo(HistoricalModel, models.Model):
    MAX_FILE_SIZE_MB = settings.MAX_VIDEO_FILE_SIZE_MB
    ALLOWED_MIME_TYPES = settings.ALLOWED_VIDEO_MIME_TYPES

    product = models.ForeignKey(to='Product', on_delete=models.CASCADE, related_name='product_videos')
    video = models.FileField(
        _('Video'),
        upload_to='products/videos/%Y/%m/%d',
        null=True,
        blank=True,
        help_text=_('Allowed video formats: %s') % ', '.join(ALLOWED_MIME_TYPES),
    )

    def __str__(self):
        return f"Video for the product '{self.product}'"

    class Meta:
        db_table = 'product_video'
        verbose_name = _('Product Videos')
        verbose_name_plural = _('Product Videos')

    def clean(self):
        super().clean()

        if self.pk is not None:
            existing_video = ProductVideo.objects.get(pk=self.pk).video

            if self.video.name == existing_video.name:
                return

        if self.video:
            try:
                mime_type, encoding = mimetypes.guess_type(self.video.name)
                if mime_type not in self.ALLOWED_MIME_TYPES:
                    raise ValidationError(errors.INVALID_VIDEO_TYPE)

            except Exception:
                raise ValidationError(errors.INVALID_VIDEO)

            if self.video.size > self.MAX_FILE_SIZE_MB * 1024 * 1024:
                raise ValidationError(errors.VIDEO_SIZE_EXCEEDED)

        # FIXME проблемі с админкой
        # if ProductVideo.objects.filter(product=self.product).exists() and not self.pk:
        # if self.product.product_videos.count() > VIDEO_UPLOAD_LIMIT:
        #     raise ValidationError(errors.PRODUCT_VIDEO_LIMIT)

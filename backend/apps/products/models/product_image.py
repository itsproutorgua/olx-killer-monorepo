import mimetypes

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _
from PIL import Image as PILImage

from apps.common import errors


class ProductImage(models.Model):
    MAX_FILE_SIZE_MB = settings.MAX_IMAGE_FILE_SIZE_MB
    ALLOWED_MIME_TYPES = settings.ALLOWED_IMAGE_MIME_TYPES

    product = models.ForeignKey(to='Product', on_delete=models.CASCADE, related_name='product_images')
    image = models.ImageField(
        _('Image'),
        upload_to='products/images/%Y/%m/%d',
        null=True,
        blank=True,
        help_text=_('Allowed image formats: %s') % ', '.join(ALLOWED_MIME_TYPES),
    )

    def __str__(self):
        return f"Image for the product '{self.product}'"

    class Meta:
        db_table = 'product_image'
        verbose_name = _('Product Image')
        verbose_name_plural = _('Product Images')

    def clean(self):
        super().clean()
        if self.image:
            try:
                with PILImage.open(self.image.file) as img:
                    mime_type, encoding = mimetypes.guess_type(self.image.name)
                    if mime_type not in self.ALLOWED_MIME_TYPES:
                        raise ValidationError(errors.INVALID_IMAGE_TYPE)
                    img.verify()
            except Exception:
                raise ValidationError(errors.INVALID_IMAGE)

            if self.image.size > self.MAX_FILE_SIZE_MB * 1024 * 1024:
                raise ValidationError(errors.IMAGE_SIZE_EXCEEDED)

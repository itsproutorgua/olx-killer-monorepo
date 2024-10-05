from django.core.files.storage import default_storage
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _


class ProductImage(models.Model):
    product = models.ForeignKey(to='Product', on_delete=models.CASCADE, related_name='product_images')
    image = models.ImageField(_('Image'), upload_to='products/%Y/%m/%d', null=True, blank=True)

    def __str__(self):
        return f"Image for the product '{self.product}'"

    class Meta:
        db_table = 'product_image'
        verbose_name = _('Product Image')
        verbose_name_plural = _('Product Images')


@receiver(post_delete, sender=ProductImage)
def delete_image_file(sender, instance, **kwargs):
    """Удаляет файл изображения с сервера при удалении ProductImage."""
    if instance.image:
        file_path = instance.image.path
        if default_storage.exists(file_path) and 'examples' not in file_path:
            default_storage.delete(file_path)

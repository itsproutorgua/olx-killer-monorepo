from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimestampMixin
from apps.products.utils import translate_and_set_fields


class Category(TimestampMixin, models.Model):
    title = models.CharField(_('Category name'), max_length=100)

    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name=_('Parent category'),
    )
    img = models.ImageField(_('Image'), upload_to='categories', blank=True, null=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.title:
            translate_and_set_fields(self, field_name_prefix='title', field_to_translate='title')

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'category'
        verbose_name = _('Category')
        verbose_name_plural = _('Categories')
        unique_together = (('title', 'parent'),)

    # url = models.URLField(_('Посилання'), unique=True)

    # def save(self, *args, **kwargs):
    #     if not self.url:
    #         self.url = self.generate_url()
    #     return super().save(*args, **kwargs)

    # def generate_url(self):
    #     if self.parent:
    #         parent_url = self.parent.generate_url()
    #         return f'{parent_url}/{slugify(self.title)}'
    #     else:
    #         return slugify(self.title)

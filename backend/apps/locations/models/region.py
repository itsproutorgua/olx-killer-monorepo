from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimestampMixin
from apps.products.utils import translate_and_set_fields


class Region(TimestampMixin, models.Model):
    name = models.CharField(_('Region'), max_length=100, unique=True)
    slug = models.SlugField('Slug', blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.name:
            translate_and_set_fields(self, field_name_prefix='name', field_to_translate='name')

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'regions'
        verbose_name = _('Region')
        verbose_name_plural = _('Regions')

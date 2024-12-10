from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimestampMixin
from apps.products.utils import translate_and_set_fields


class Village(TimestampMixin, models.Model):
    name = models.CharField(_('Village Name'), max_length=100)
    region = models.ForeignKey('Region', on_delete=models.CASCADE, related_name='villages', verbose_name=_('Region'))

    def __str__(self):
        return f'{self.name}'

    def save(self, *args, **kwargs):
        if self.name:
            translate_and_set_fields(self, field_name_prefix='name', field_to_translate='name')

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'village'
        verbose_name = _('Village')
        verbose_name_plural = _('Villages')
        unique_together = (('name', 'region'),)

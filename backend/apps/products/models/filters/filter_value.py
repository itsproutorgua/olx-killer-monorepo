from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.products.models.filters.filter import Filter


class FilterValue(models.Model):
    filter = models.ForeignKey(Filter, related_name='values', on_delete=models.CASCADE)
    label = models.CharField('Label', max_length=255)
    value = models.CharField('Value', max_length=100)

    def __str__(self):
        return self.label

    class Meta:
        db_table = 'filter_values'
        verbose_name = _('Filter value')
        verbose_name_plural = _('Filter values')

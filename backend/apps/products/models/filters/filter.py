from deep_translator import GoogleTranslator
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimestampMixin


class Filter(TimestampMixin, models.Model):
    FILTER_TYPE_CHOICES = [
        ('checkbox', 'Checkbox'),
        ('checkboxes', 'Checkboxes'),
        ('select', 'Select'),
        ('input', 'Input'),
        ('salary', 'Salary'),
        ('price', 'Price'),
    ]

    name = models.CharField('Name', max_length=255)  # English !!! For frontend
    type = models.CharField('Type', max_length=20, choices=FILTER_TYPE_CHOICES)
    label = models.CharField('Label', max_length=255)
    unit = models.CharField('Unit', max_length=50, blank=True, null=True)
    scope = models.CharField('Scope', max_length=50, blank=True, null=True)

    def __str__(self):
        return self.label

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = GoogleTranslator(target='en').translate(self.label)
        super(Filter, self).save(*args, **kwargs)

    class Meta:
        db_table = 'filters'
        verbose_name = _('Filter')
        verbose_name_plural = _('Filters')

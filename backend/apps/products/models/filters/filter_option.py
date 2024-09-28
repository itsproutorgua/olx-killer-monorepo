from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.products.models.filters.filter import Filter


class FilterOption(models.Model):
    CONSTRAINT_TYPE_CHOICES = [
        ('string', 'String'),
        ('integer', 'Integer'),
        ('float', 'Float'),
        ('bool', 'Boolean'),
    ]

    filter = models.ForeignKey(Filter, related_name='options', on_delete=models.CASCADE)
    categories = models.ManyToManyField('Category', related_name='filter_options')
    order = models.IntegerField('Order', blank=True, null=True)
    ranges = models.JSONField('Ranges', blank=True, null=True)
    constraints = models.CharField('Constraint type', max_length=20, choices=CONSTRAINT_TYPE_CHOICES)

    def __str__(self):
        return _(f'Option for {self.filter}')

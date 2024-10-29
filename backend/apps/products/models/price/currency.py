from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import HistoricalModel
from apps.common.models import TimestampMixin


class Currency(TimestampMixin, HistoricalModel, models.Model):
    code = models.CharField(_('Currency code'), max_length=3, unique=True)
    symbol = models.CharField(_('Currency symbol'), max_length=5, blank=True, null=True)
    name = models.CharField(_('Currency name'), max_length=50)

    def __str__(self):
        return f'{self.code}'

    class Meta:
        db_table = 'currency'
        verbose_name = _('Currency')
        verbose_name_plural = _('Currencies')

from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimestampMixin
from apps.common.models import HistoricalModel

MIN_PRICE = Decimal(0.0)
ERROR_MIN_PRICE_MESSAGE = _(f'Must be greater than or equal to {MIN_PRICE}.')


class Price(TimestampMixin, HistoricalModel, models.Model):
    amount = models.DecimalField(
        _('Amount'),
        max_digits=13,
        decimal_places=2,
        validators=[MinValueValidator(MIN_PRICE, message=ERROR_MIN_PRICE_MESSAGE)],
    )
    currency = models.ForeignKey('Currency', on_delete=models.CASCADE, verbose_name=_('Currency'))
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name='prices', verbose_name=_('Product'))

    def __str__(self):
        return f'{self.amount} {self.currency}'

    class Meta:
        db_table = 'price'
        verbose_name = _('Price')
        verbose_name_plural = _('Prices')
        unique_together = ('product', 'currency')

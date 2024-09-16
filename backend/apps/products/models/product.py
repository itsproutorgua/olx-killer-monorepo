from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimestampMixin


User = get_user_model()

MIN_PRICE = Decimal('0.0')
ERROR_MIN_PRICE_MESSAGE = _(f'Must be greater than or equal to {MIN_PRICE}.')


class Product(TimestampMixin, models.Model):
    title = models.CharField(_('Product name'), max_length=255)
    price = models.DecimalField(
        _('Price'),
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(MIN_PRICE, message=_(ERROR_MIN_PRICE_MESSAGE))],
    )
    description = models.TextField(verbose_name=_('Product description'), blank=True)
    seller = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name='product_sellers',
        verbose_name=_('Seller'),
    )
    category = models.ForeignKey(
        to='Category',
        on_delete=models.PROTECT,
        related_name='category_products',
        verbose_name=_('Category'),
    )

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'product'
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        unique_together = ('title', 'seller')

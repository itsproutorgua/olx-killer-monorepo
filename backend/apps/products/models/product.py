from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import TimestampMixin


User = get_user_model()


class Product(TimestampMixin, models.Model):
    title = models.CharField(_('Product name'), max_length=255)
    description = models.TextField(verbose_name=_('Product description'), blank=True, null=True)
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
    params = models.JSONField(_('Parameters'), default=dict, blank=True, null=True)
    prod_olx_id = models.IntegerField('Product OLX ID', blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'product'
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        unique_together = ('title', 'seller', 'category')

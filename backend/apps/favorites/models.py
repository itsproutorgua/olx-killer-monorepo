from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import HistoricalModel
from apps.common.models import TimestampMixin
from apps.products.models import Product


User = get_user_model()


class Favorite(TimestampMixin, HistoricalModel, models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name=_('User'),
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='favorites',
        verbose_name=_('Product'),
    )

    def __str__(self):
        return f'{self.user} - {self.product}'

    class Meta:
        db_table = 'favorites'
        verbose_name = _('Favorite')
        verbose_name_plural = _('Favorites')
        unique_together = ('user', 'product')

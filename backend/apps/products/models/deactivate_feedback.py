from django.db import models
from django.db import transaction
from django.utils.translation import gettext_lazy as _

from apps.common.models import HistoricalModel
from apps.common.models import TimestampMixin
from apps.products.models.product import Product


class ProductDeactivationFeedback(TimestampMixin, HistoricalModel, models.Model):
    class AnswerStatus(models.TextChoices):
        SOLD = 'sold', _('Sold')
        SOLD_ELSEWHERE = 'sold_elsewhere', _('Sold Elsewhere')
        NOT_SOLD = 'not_sold', _('Not Sold')

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='deactivated_product',
        verbose_name=_('Product'),
        help_text=_('The product that has been deactivated.'),
    )
    answer = models.CharField(
        max_length=20,
        choices=AnswerStatus.choices,
        default=AnswerStatus.SOLD,
        verbose_name=_('Sale Status'),
        help_text=_('The current sale status of the deactivated product.'),
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Deactivation Reason'),
        help_text=_(
            'Description of why the product was deactivated, including the reason and any additional comments.'
        ),
    )

    def __str__(self):
        return f'{self.product}'

    class Meta:
        db_table = 'deactivation_feedbacks'
        verbose_name = _('Deactivation Feedback')
        verbose_name_plural = _('Deactivation Feedbacks')

    def save(self, *args, **kwargs):
        match self.answer:
            case self.AnswerStatus.SOLD | self.AnswerStatus.SOLD_ELSEWHERE:
                self.product.publication_status = Product.PublicationStatus.INACTIVE
            case self.AnswerStatus.NOT_SOLD:
                self.product.publication_status = Product.PublicationStatus.INACTIVE
            case _:
                self.product.publication_status = Product.PublicationStatus.DELETED

        with transaction.atomic():
            self.product.save(update_fields=('publication_status', 'updated_at'))
            super().save(*args, **kwargs)

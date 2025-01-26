from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _
from slugify import slugify

from apps.common.models import HistoricalModel
from apps.common.models import TimestampMixin


User = get_user_model()


class Product(TimestampMixin, HistoricalModel, models.Model):
    class Status(models.TextChoices):
        NEW = 'new', _('New')
        OLD = 'old', _('Old')

    class PublicationStatus(models.TextChoices):
        ACTIVE = 'active', _('Active')
        INACTIVE = 'inactive', _('Inactive')
        DRAFT = 'draft', _('Draft')  # Очікуючі
        REJECTED = 'rejected', _('Rejected')  # Відхилені

    title = models.CharField(_('Product name'), max_length=255)
    description = models.TextField(verbose_name=_('Product description'), blank=True, null=True)
    seller = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name='seller_products',
        verbose_name=_('Seller'),
    )
    category = models.ForeignKey(
        to='Category',
        on_delete=models.PROTECT,
        related_name='products',
        verbose_name=_('Category'),
    )
    status = models.CharField(
        _('Status'),
        max_length=20,
        choices=Status.choices,
        default=Status.OLD,
        help_text=_('Product status'),
    )
    publication_status = models.CharField(
        _('Publication status'),
        max_length=20,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
        help_text=_(
            'Defines the visibility of the product. Select `Active` to make the product publicly available, '
            '`Draft` for unpublished items under review, or `Rejected` for products that are not approved.'
        ),
    )
    views = models.IntegerField(_('Views'), default=0)
    params = models.JSONField(_('Parameters'), default=dict, blank=True, null=True)
    prod_olx_id = models.IntegerField('Product OLX ID', blank=True, null=True, editable=False)
    slug = models.SlugField(max_length=255, unique=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'product'
        verbose_name = _('Product')
        verbose_name_plural = _('Products')
        unique_together = ('title', 'seller', 'category')

    def save(self, *args, **kwargs):
        slug = slugify(self.title)
        if self.title:
            if not self.pk:
                self.slug = slug
            else:
                self.slug = slug + str(self.pk)

        super().save(*args, **kwargs)

        if self.pk and self.slug != slug + str(self.pk):
            self.slug = slug + str(self.pk)
            super().save(update_fields=['slug'])

        if not self.product_images.exists():
            from apps.products.models import ProductImage

            ProductImage.objects.create(product=self)
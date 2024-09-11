from django.db import models
from django.utils.translation import gettext_lazy as _


class ProductImage(models.Model):
    product = models.ForeignKey(
        to="Product", on_delete=models.CASCADE, related_name="product_images"
    )
    image = models.ImageField(
        _("Image"), upload_to="products/%Y/%m/%d", null=True, blank=True
    )

    def __str__(self):
        return f"Image for the product '{self.product.title}'"

    class Meta:
        db_table = "product_image"
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")

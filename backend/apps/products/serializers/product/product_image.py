from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.products.models import Product
from apps.products.models import ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']
        read_only_fields = ['id']

    @staticmethod
    def validate_image(value):
        mime_type = value.content_type
        allowed_mime_types = ProductImage.ALLOWED_MIME_TYPES

        if mime_type not in allowed_mime_types:
            raise serializers.ValidationError(_('Invalid file type. Allowed types: %s') % ', '.join(allowed_mime_types))

        max_file_size_mb = ProductImage.MAX_FILE_SIZE_MB
        if value.size > max_file_size_mb * 1024 * 1024:
            raise serializers.ValidationError(_('The image size cannot exceed %s MB.') % max_file_size_mb)

        return value

    def create(self, validated_data: dict) -> ProductImage:
        product = validated_data.pop('product', None)

        if product is None:
            raise ValidationError(_('The product does not exist.'))

        return ProductImage.objects.create(product=product, **validated_data)

    @classmethod
    def create_images(cls, product: Product, images_data: dict) -> None:
        """A method for creating images for a product."""
        for image_data in images_data:
            try:
                image_data['product'] = product
                cls().create(image_data)
            except IntegrityError as e:
                raise ValidationError(_('Failed to create product image: {}'.format(e)))

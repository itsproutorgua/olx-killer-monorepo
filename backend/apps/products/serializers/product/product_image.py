from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

from apps.common import errors
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
        image = validated_data.get('image')
        img = Image.open(image)

        if img.mode == 'RGBA':
            img = img.convert('RGB')

        img.thumbnail((300, 300), Image.Resampling.LANCZOS)

        buffer = BytesIO()
        img.save(buffer, format='JPEG', quality=75, optimize=True, progressive=True)
        buffer.seek(0)
        
        file_name = f"{image.name.rsplit('.', 1)[0]}.jpg"

        validated_data['image'] = ContentFile(buffer.read(), name=file_name)

        if product is None:
            raise ValidationError(_('The product does not exist.'))

        return ProductImage.objects.create(product=product, **validated_data)

    @classmethod
    def create_images(cls, product: Product, images_data: list) -> None:
        """A method for creating images for a product."""
        max_count_images = settings.MAX_COUNT_IMAGE_FILES
        if len(images_data) > max_count_images:
            raise ValidationError(errors.INVALID_COUNT_IMAGE.format(max_count_images), code='invalid_count_images')

        with transaction.atomic():
            if images_data:
                product.product_images.all().delete()

            for image_data in images_data:
                try:
                    image_data = {'product': product, 'image': image_data}
                    cls().create(image_data)
                except IntegrityError as e:
                    raise ValidationError(_('Failed to create product image: {}'.format(e)))

            if not images_data and product.product_images.first() is None:
                cls().create({'product': product})

from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.locations.serializers.location import LocationSerializer
from apps.products.models import Category
from apps.products.models import Price
from apps.products.models import ProductImage
from apps.products.models.product import Product
from apps.products.serializers.price import PriceSerializer
from apps.products.serializers.product_image import ProductImageSerializer


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    prices = PriceSerializer(many=True)
    images = ProductImageSerializer(many=True, source='product_images')
    location = LocationSerializer()

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'prices',
            'description',
            'images',
            'category',
            'seller',
            'location',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'seller', 'location']

    def create(self, validated_data):
        title = validated_data.pop('title')
        category = validated_data.pop('category')
        images_data = validated_data.pop('product_images') or []
        prices_data = validated_data.pop('prices') or []
        user = self.context['request'].user

        try:
            product = Product.objects.create(category=category, seller=user, title=title, **validated_data)
        except IntegrityError as e:
            raise ValidationError(_('Database integrity error: {}'.format(e)))

        for price_data in prices_data:
            try:
                Price.objects.create(product=product, **price_data)
            except IntegrityError as e:
                raise ValidationError(_('Failed to create price: {}'.format(e)))

        for image_data in images_data:
            try:
                ProductImage.objects.create(product=product, **image_data)
            except IntegrityError as e:
                raise ValidationError(_('Failed to create product image: {}'.format(e)))

        return product

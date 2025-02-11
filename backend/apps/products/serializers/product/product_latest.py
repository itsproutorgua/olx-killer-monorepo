from rest_framework import serializers

from apps.products.models.product import Product
from apps.products.serializers.price.price import PriceSerializer
from apps.products.serializers.product.product_image import ProductImageSerializer


class LatestProductSerializer(serializers.ModelSerializer):
    prices = PriceSerializer(many=True)
    images = ProductImageSerializer(many=True, source='product_images')

    class Meta:
        model = Product
        fields = [
            'title',
            'prices',
            'description',
            'images',
            'slug',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'slug']

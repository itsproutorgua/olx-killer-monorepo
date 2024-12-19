from rest_framework import serializers

from apps.products.models.product import Product
from apps.products.serializers.price.price import PriceSerializer
from apps.products.serializers.product.product_image import ProductImageSerializer


class UserProductsSerializer(serializers.ModelSerializer):
    prices = PriceSerializer(many=True)
    images = ProductImageSerializer(many=True, source='product_images')

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'prices',
            'images',
            'active',
            'slug',
            'views',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'slug', 'views']

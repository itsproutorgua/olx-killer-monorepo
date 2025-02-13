from rest_framework import serializers

from apps.products.models.product import Product
from apps.products.serializers.price.price import PriceSerializer
from apps.products.serializers.product.product_image import ProductImageSerializer
from apps.products.serializers.product.product_video import ProductVideoSerializer


class LatestProductSerializer(serializers.ModelSerializer):
    prices = PriceSerializer(many=True)
    images = ProductImageSerializer(many=True, source='product_images')
    video = ProductVideoSerializer(source='product_videos', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'prices',
            'description',
            'video',
            'images',
            'slug',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'slug']

from rest_framework import serializers

from apps.products.models.product import Product
from apps.products.serializers import CategorySerializer
from apps.products.serializers.product_image import ProductImageSerializer


# from apps.users.serializers.seller import SellerSerializer


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    # seller = SellerSerializer(read_only=True)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    images = ProductImageSerializer(many=True, source='product_images')

    class Meta:
        model = Product
        # fields = ['id', 'title', 'price', 'description', 'images', 'seller', 'category', 'created_at', 'updated_at']
        fields = [
            'id',
            'title',
            'price',
            'description',
            'images',
            'category',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['seller', 'created_at', 'updated_at']

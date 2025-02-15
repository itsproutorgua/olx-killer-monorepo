from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.products.models import Product
from apps.products.serializers import CategorySerializer
from apps.products.serializers.price.price import PriceSerializer
from apps.products.serializers.product.product_image import ProductImageSerializer
from apps.users.serializers.product_profile import ProductProfileSerializer


class ProductSearchSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    prices = PriceSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, source='product_images', read_only=True)
    seller = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'slug',
            'title',
            'status',
            'images',
            'prices',
            'seller',
            'category',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['status'] = instance.get_status_display()

        return representation

    @staticmethod
    @extend_schema_field(ProductProfileSerializer)
    def get_seller(obj: Product) -> ProductProfileSerializer:
        return ProductProfileSerializer(obj.seller.profile).data

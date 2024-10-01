from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.products.models import Category
from apps.products.models import ProductImage
from apps.products.models.product import Product
from apps.products.serializers.product_image import ProductImageSerializer


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    images = ProductImageSerializer(many=True, source='product_images')

    class Meta:
        model = Product
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
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        category = validated_data.pop('category')
        images_data = validated_data.pop('product_images', [])
        user = self.context['request'].user

        if category is None:
            raise serializers.ValidationError(_('Category ID must be provided.'))

        product = Product.objects.create(category=category, seller=user, **validated_data)

        for image_data in images_data:
            ProductImage.objects.create(product=product, **image_data)

        return product

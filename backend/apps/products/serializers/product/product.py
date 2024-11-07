from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.products.models import Price
from apps.products.models.product import Product
from apps.products.serializers import CategorySerializer
from apps.products.serializers.price.price import PriceSerializer
from apps.products.serializers.product.product_image import ProductImageSerializer
from apps.products.serializers.product.product_video import ProductVideoSerializer
from apps.users.serializers.profile import ProfileSerializer


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    prices = PriceSerializer(many=True)
    images = ProductImageSerializer(many=True, source='product_images')
    video = ProductVideoSerializer(required=False)
    seller = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'title',
            'prices',
            'description',
            'category',
            'images',
            'video',
            'seller',
            'status',
            'active',
            'slug',
            'views',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'seller', 'slug', 'views']

    @extend_schema_field(ProfileSerializer)
    def get_seller(self, obj: Product) -> ProfileSerializer:
        return ProfileSerializer(obj.seller.profile).data

    @staticmethod
    def get_status(obj: Product) -> str:
        return obj.get_status_display()

    def create(self, validated_data: dict) -> Product:
        title = validated_data.pop('title')
        category = validated_data.pop('category')
        images_data = validated_data.pop('product_images') or []
        video_data = validated_data.pop('video', None)
        prices_data = validated_data.pop('prices') or []
        user = self.context['request'].user

        try:
            product = Product.objects.create(category=category, seller=user, title=title, **validated_data)
        except IntegrityError as e:
            raise ValidationError(_('Database integrity error: {}'.format(e)))

        try:
            PriceSerializer.create_prices(product, prices_data)
        except ValidationError as e:
            raise ValidationError(_('Failed to create product prices: {}'.format(e)))

        try:
            ProductImageSerializer.create_images(product, images_data)
        except ValidationError as e:
            raise ValidationError(_('Failed to create product images: {}'.format(e)))

        if video_data is not None:
            video_data['product'] = product
            video_serializer = ProductVideoSerializer(data=video_data)
            if video_serializer.is_valid(raise_exception=True):
                video_serializer.save()

        return product

    def update(self, instance: Product, validated_data: dict) -> Product:
        images_data = validated_data.pop('product_images', None)
        video_data = validated_data.pop('video', None)
        prices_data = validated_data.pop('prices', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if prices_data is not None:
            for price_data in prices_data:
                currency = price_data.get('currency', None)
                if currency:
                    try:
                        price_instance = instance.prices.get(currency__code=currency)
                        for attr, value in price_data.items():
                            setattr(price_instance, attr, value)
                        price_instance.save()
                    except Price.DoesNotExist:
                        raise ValidationError(_('Price with currency {} does not exist.'.format(currency)))
                else:
                    price_data['product'] = instance
                    try:
                        PriceSerializer.create(validated_data=price_data)
                    except ValidationError as e:
                        raise ValidationError(_('Failed to create product price: {}'.format(e)))

        if images_data is not None:
            ProductImageSerializer.create_images(instance, images_data)

        if video_data:
            existing_videos = instance.product_videos.all()
            if existing_videos.exists():
                video_serializer = ProductVideoSerializer(
                    instance=existing_videos.first(), data=video_data, partial=True
                )
                if video_serializer.is_valid(raise_exception=True):
                    video_serializer.save()
            else:
                video_data['product'] = instance
                video_serializer = ProductVideoSerializer(data=video_data)
                if video_serializer.is_valid(raise_exception=True):
                    video_serializer.save()

        return instance

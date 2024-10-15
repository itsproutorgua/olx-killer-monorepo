# Временный сериализатор для создания данных через скрапер
from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.products.models import Category
from apps.products.models import Currency
from apps.products.models import Price
from apps.products.models import Product
from apps.products.utils.api_parser_helpers.image_utils import save_base64_image_to_product
from apps.products.utils.api_parser_helpers.image_utils import save_image_without_data_image
from apps.products.utils.api_parser_helpers.user_utils import create_user
from settings import env


User = get_user_model()


class TMPImageSerializer(serializers.Serializer):
    name = serializers.CharField(required=True)
    data = serializers.CharField(required=True)


class TMPProductSerializer(serializers.Serializer):
    cat_id_olx = serializers.IntegerField(write_only=True)
    title = serializers.CharField()
    price_uah = serializers.DecimalField(max_digits=13, decimal_places=2, write_only=True)
    price_usd = serializers.DecimalField(max_digits=13, decimal_places=2, write_only=True)
    description = serializers.CharField(required=False)
    images = serializers.ListField(child=TMPImageSerializer(), write_only=True, required=False, allow_null=True)
    seller = serializers.JSONField(write_only=True)
    prod_olx_id = serializers.IntegerField(write_only=True)
    secret_key = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Product
        fields = [
            'secret_key',
            'cat_id_olx',
            'prod_olx_id',
            'title',
            'price_uah',
            'price_usd',
            'description',
            'images',
            'seller',
        ]

    def create(self, validated_data):
        created = False

        if validated_data.get('secret_key') is None:
            raise serializers.ValidationError('Получишь по рукам!!!')

        secret_key = validated_data.pop('secret_key')
        cat_id_olx = validated_data.pop('cat_id_olx')
        images_data = validated_data.pop('images') or []
        user_data = validated_data.pop('seller')
        product_title = validated_data.pop('title')
        price_uah = validated_data.pop('price_uah')
        price_usd = validated_data.pop('price_usd')

        if secret_key != env('SECRET_KEY_PRODUCT'):
            raise serializers.ValidationError('Не угадал...')

        if cat_id_olx is None:
            raise serializers.ValidationError('Category ID must be provided.')

        if user_data is None:
            raise serializers.ValidationError('User data must be provided.')

        user = create_user(user_data)
        try:
            category = Category.objects.get(cat_id_olx=cat_id_olx)
        except Category.DoesNotExist:
            raise serializers.ValidationError(f'Category OLX ID {cat_id_olx} NOT FOUND!')

        product = Product.objects.filter(category=category, seller=user, title=product_title).first()

        if product is None:
            currencies = Currency.objects.filter(code__in=['UAH', 'USD']).all()
            product = Product.objects.create(category=category, seller=user, title=product_title, **validated_data)
            Price.objects.create(product=product, amount=price_uah, currency=currencies.get(code='UAH'))
            Price.objects.create(product=product, amount=price_usd, currency=currencies.get(code='USD'))
            created = bool(product)

        if len(images_data) > 0:
            for image_data in images_data:
                save_base64_image_to_product(image_data=image_data, product=product)
        else:
            save_image_without_data_image(product=product)

        return product, created

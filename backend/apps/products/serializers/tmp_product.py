# Временный сериализатор для создания данных через скрапер
import mimetypes

import requests
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from faker import Faker
from rest_framework import serializers

from apps.products.models import Category
from apps.products.models import Product
from apps.products.models import ProductImage
from settings import env


User = get_user_model()
faker = Faker(['en_US', 'uk_UA', 'ru_RU'])
faker_ua = Faker('uk_UA')


def download_image(image_url: str) -> ContentFile | None:
    response = requests.get(image_url)
    if response.status_code == 200:
        image_name = image_url.split('/')[-2]
        content_type = response.headers.get('Content-Type')

        # Определяем расширение файла
        extension = mimetypes.guess_extension(content_type)
        if not extension:
            extension = '.jpg'

        image_name_with_extension = f'{image_name}{extension}'

        return ContentFile(response.content, name=image_name_with_extension)


def create_image(image_url: str, product: Product) -> None:
    image = download_image(image_url)
    if image:
        images = ProductImage.objects.filter(product=product)
        existing_image = any(image.name == img.image.name.split('/')[-1] for img in images)

        if not existing_image:
            ProductImage.objects.create(product=product, image=image)


def create_user(user_data: dict) -> User:
    user, _ = User.objects.get_or_create(
        olx_id=user_data['olx_id'],
        defaults={
            'email': f'{user_data['olx_id']}{faker.email()}',
            'username': user_data.get('username', faker.user_name()),
            'first_name': user_data.get('name', faker.first_name()),
            'last_name': user_data.get('last_name', faker.last_name()),
            'phone_number': user_data.get('phone_number', faker_ua.phone_number()),
            'is_fake_user': True,
        },
    )

    return user


class TMPProductSerializer(serializers.Serializer):
    cat_id_olx = serializers.IntegerField(write_only=True)
    title = serializers.CharField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    description = serializers.CharField()
    images = serializers.ListField(child=serializers.URLField(), write_only=True)
    seller = serializers.JSONField(write_only=True)
    secret_key = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Product
        fields = ['secret_key', 'cat_id_olx', 'title', 'price', 'description', 'images', 'seller']

    def create(self, validated_data):
        if validated_data.get('secret_key') is None:
            raise serializers.ValidationError('Получишь по рукам!!!')

        secret_key = validated_data.pop('secret_key')
        cat_id_olx = validated_data.pop('cat_id_olx')
        images_urls = validated_data.pop('images', [])
        user_data = validated_data.pop('seller')

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

        product, _ = Product.objects.update_or_create(category=category, seller=user, **validated_data)

        for image_url in images_urls:
            create_image(image_url, product)

        return product

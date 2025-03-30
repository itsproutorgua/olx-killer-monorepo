from django.db import transaction
from django.db.utils import IntegrityError
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

import settings
from apps.common import errors
from apps.products.models import Category
from apps.products.models import Currency
from apps.products.models.price.price import MIN_PRICE
from apps.products.models.product import Product
from apps.products.serializers import CategorySerializer
from apps.products.serializers.price.price import PriceSerializer
from apps.products.serializers.product.product_image import ProductImageSerializer
from apps.products.serializers.product.product_video import ProductVideoSerializer
from apps.users.serializers.product_profile import ProductProfileSerializer


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), write_only=True, required=True)
    prices = PriceSerializer(many=True, required=False, read_only=True)
    amount = serializers.DecimalField(
        max_digits=13,
        decimal_places=2,
        min_value=MIN_PRICE,
        write_only=True,
        required=False,
    )
    currency = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all(), write_only=True, required=False)
    images = ProductImageSerializer(many=True, source='product_images', read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(use_url=True, allow_null=True),
        write_only=True,
        required=False,
        allow_empty=True,
    )
    video = ProductVideoSerializer(source='product_videos', read_only=True, many=True)
    upload_video = serializers.FileField(write_only=True, required=False)
    seller = serializers.SerializerMethodField(read_only=True)
    status = serializers.ChoiceField(choices=Product.Status.choices)

    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'prices',
            'amount',
            'currency',
            'description',
            'category_id',
            'category',
            'uploaded_images',
            'images',
            'video',
            'upload_video',
            'seller',
            'status',
            'publication_status',
            'slug',
            'views',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'seller', 'slug', 'views']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if not self.instance:
            del self.fields['publication_status']

        if self.instance:
            self.fields['publication_status'].required = False
            self.fields['publication_status'].choices = [
                (Product.PublicationStatus.ACTIVE, Product.PublicationStatus.ACTIVE.value),
                (Product.PublicationStatus.INACTIVE, Product.PublicationStatus.INACTIVE.value),
            ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        representation['status'] = instance.get_status_display()
        representation['publication_status'] = instance.get_publication_status_display()

        return representation

    def to_internal_value(self, data):
        if 'uploaded_images' in data:
            data = data.copy()
            uploaded_images = data.get('uploaded_images')
            if uploaded_images is None or uploaded_images == '':
                data['uploaded_images'] = None

        return super().to_internal_value(data)

    def validate(self, attrs):
        unknown_fields = set(self.initial_data.keys()) - set(self.fields.keys())
        if unknown_fields:
            raise ValidationError(
                {field: 'This field is not allowed.' for field in unknown_fields},
                code='unknown_fields',
            )

        return attrs

    @staticmethod
    @extend_schema_field(ProductProfileSerializer)
    def get_seller(obj: Product) -> ProductProfileSerializer:
        return ProductProfileSerializer(obj.seller.profile).data

    def create(self, validated_data: dict) -> Product:
        title = validated_data.pop('title', None)
        category_id = validated_data.pop('category_id', None)
        images_data = validated_data.pop('uploaded_images', [])
        video_file = validated_data.pop('upload_video', None)
        amount = validated_data.pop('amount', MIN_PRICE)
        currency = validated_data.pop('currency', settings.DEFAULT_CURRENCY)
        prices_data = [{'amount': amount, 'currency': currency}]
        user = self.context['request'].user

        with transaction.atomic():
            try:
                product = Product.objects.create(category=category_id, seller=user, title=title, **validated_data)
            except IntegrityError:
                raise ValidationError(
                    _('A product with this title, category, and seller already exists.'),
                    code='duplicate_title',
                )
            except ValidationError as e:
                raise ValidationError(_('Failed to create product: {}'.format(e)), code='validation_error')

            try:
                PriceSerializer.create_prices(product, prices_data)
            except ValidationError as e:
                raise ValidationError(_('Failed to create product prices: {}'.format(e)), code='validation_error')

            try:
                ProductImageSerializer.create_images(product, images_data)
            except ValidationError as e:
                raise ValidationError(_('Failed to create product images: {}'.format(e)), code='validation_error')

            try:
                ProductVideoSerializer.create_video(product, video_file)
            except ValidationError as e:
                raise ValidationError(_('Failed to create product video: {}'.format(e)), code='validation_error')

        return product

    def update(self, instance: Product, validated_data: dict) -> Product:
        publication_status = validated_data.pop('publication_status', None)

        if not validated_data and publication_status:
            instance.publication_status = publication_status
            instance.save()
            return instance

        category = validated_data.pop('category_id', None)
        video_file = validated_data.pop('upload_video', None)
        images_data = validated_data.pop('uploaded_images', [])
        amount = validated_data.pop('amount', MIN_PRICE)
        currency = validated_data.pop('currency', settings.DEFAULT_CURRENCY)
        prices_data = [{'amount': amount, 'currency': currency}]

        if category:
            validated_data['category'] = category

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        try:
            PriceSerializer.update_prices(instance, prices_data)
        except ValidationError as e:
            raise ValidationError(_('Failed to update product prices: {}'.format(e)), code='validation_error')

        if images_data is not None:
            ProductImageSerializer.create_images(instance, images_data)

        if video_file:
            ProductVideoSerializer.create_video(instance, video_file)

        instance.publication_status = Product.PublicationStatus.DRAFT
        instance.save()
        return instance

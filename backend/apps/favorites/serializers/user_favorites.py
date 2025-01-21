from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.favorites.models import Favorite
from apps.log_config import logger
from apps.products.models import Product
from apps.products.serializers.price.price import PriceSerializer
from apps.products.serializers.product.product_image import ProductImageSerializer


SUPPORTED_LANGUAGES_TO_CURRENCIES = {
    'uk': 'UAH',
    'en': 'USD',
}


class UserFavoriteSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
    )
    product_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'product', 'product_details', 'created_at')
        read_only_fields = ('id', 'created_at')

    def validate_product(self, product):
        if Favorite.objects.filter(user=self.context['request'].user, product=product).exists():
            raise serializers.ValidationError(_('This product has already been added to your favorites.'))
        return product

    def create(self, validated_data: dict):
        user = self.context['request'].user
        product = validated_data.pop('product')

        return Favorite.objects.create(user=user, product=product)

    def get_product_details(self, obj: Favorite) -> dict:
        return {
            'id': obj.product.id,
            'title': obj.product.title,
            'price': self.get_price(obj),
            'images': ProductImageSerializer(obj.product.product_images.all(), many=True).data,
            'slug': obj.product.slug,
            'updated_at': obj.product.updated_at,
            'created_at': obj.product.created_at,
        }

    def get_price(self, obj) -> str:
        prices = PriceSerializer(obj.product.prices.all(), many=True).data
        current_language = self.context['request'].LANGUAGE_CODE
        current_currency = SUPPORTED_LANGUAGES_TO_CURRENCIES.get(current_language, 'UAH')

        for price in prices:
            if (code := price.get('currency')['code']) == current_currency:
                amount = price.get('amount')
                currency_code = code
                return f'{amount} {currency_code}'

        logger.error(f'Could not find price for {obj.product}')
        return _('Price not available')

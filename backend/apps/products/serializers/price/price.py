from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.products.models import Currency
from apps.products.models import Price
from apps.products.models import Product
from apps.products.models.price.price import MIN_PRICE
from apps.products.serializers.price.currency import CurrencySerializer


class PriceSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(max_digits=13, decimal_places=2, min_value=MIN_PRICE)
    currency = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all(), write_only=True)

    def to_representation(self, instance):
        """
        Customize the representation of the Price instance.

        This method modifies the serialized output by replacing the
        currency ID with its full serialized representation.
        """
        representation = super().to_representation(instance)
        representation['currency'] = CurrencySerializer(instance.currency).data
        return representation

    class Meta:
        model = Price
        fields = ['id', 'amount', 'currency']

    def create(self, validated_data: dict) -> Price:
        try:
            return Price.objects.create(**validated_data)
        except Currency.DoesNotExist:
            raise ValidationError(_('Invalid currency specified.'), code='invalid_currency_specified')
        except IntegrityError as e:
            raise ValidationError(_('Failed to create price: {}'.format(e)), code='duplicate')

    @classmethod
    def create_prices(cls, product: Product, prices_data: list) -> None:
        """
        Create multiple Price instances for a given product.

        This method iterates over the provided prices data,
        creates a Price instance for each entry, and associates
        it with the specified product.
        """

        for price_data in prices_data:
            try:
                price_data['product'] = product
                cls().create(price_data)
            except IntegrityError as e:
                raise ValidationError(_('Failed to create product price: {}'.format(e)), code='duplicate')

        if not prices_data and product.prices.first() is None:
            cls().create({'product': product})

    @classmethod
    def update_prices(cls, product: Product, prices_data: list) -> None:
        """
        Update or create prices for a given product.

        Args:
            product (Product): The product instance.
            prices_data (list): List of dictionaries containing price data.
        """
        for price_data in prices_data:
            currency_id = price_data.get('currency')
            if currency_id is None:
                raise ValidationError(_('Invalid currency specified.'), code='invalid_currency')
            try:
                price_instance = product.prices.get(currency_id=currency_id)
                for attr, value in price_data.items():
                    setattr(price_instance, attr, value)
                price_instance.save()
            except Price.DoesNotExist:
                price_data['product'] = product
                cls().create(price_data)
            except IntegrityError as e:
                raise ValidationError(_('Failed to update price: {}'.format(e)), code='duplicate')

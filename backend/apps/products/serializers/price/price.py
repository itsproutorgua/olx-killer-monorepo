from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from apps.products.models import Currency
from apps.products.models import Price
from apps.products.models import Product
from apps.products.serializers.price.currency import CurrencySerializer


class PriceSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(max_digits=13, decimal_places=2)
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
        currency_id = validated_data.pop('currency')
        try:
            currency = Currency.objects.get(id=currency_id)
            validated_data['currency'] = currency
            return Price.objects.create(**validated_data)
        except Currency.DoesNotExist:
            raise ValidationError(_('Invalid currency specified.'))
        except IntegrityError as e:
            raise ValidationError(_('Failed to create price: {}'.format(e)))

    @classmethod
    def create_prices(cls, product: Product, prices_data: dict) -> None:
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
                raise ValidationError(_('Failed to create product price: {}'.format(e)))

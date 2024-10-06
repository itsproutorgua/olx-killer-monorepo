from rest_framework import serializers

from apps.products.models import Currency
from apps.products.models import Price
from apps.products.serializers.currency import CurrencySerializer


class PriceSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.PrimaryKeyRelatedField(queryset=Currency.objects.all(), write_only=True)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['currency'] = CurrencySerializer(instance.currency).data
        return representation

    class Meta:
        model = Price
        fields = ['id', 'amount', 'currency']

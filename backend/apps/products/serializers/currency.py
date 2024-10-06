from rest_framework import serializers

from apps.products.models import Currency


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ('id', 'code', 'symbol', 'name')

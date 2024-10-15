from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import generics
from rest_framework.permissions import AllowAny

from apps.api_tags import CURRENCY
from apps.products.models import Currency
from apps.products.serializers.price import CurrencySerializer


@extend_schema(
    tags=[CURRENCY],
    summary=_('Retrieve a list of all currencies'),
    description=_('Returns a list of available currencies with their code, symbol, and name.'),
    responses={200: CurrencySerializer(many=True)},
)
class CurrencyListView(generics.ListAPIView):
    queryset = Currency.objects.all().order_by('id')
    serializer_class = CurrencySerializer
    permission_classes = [AllowAny]

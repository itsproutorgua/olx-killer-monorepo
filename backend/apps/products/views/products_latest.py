from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import OpenApiResponse
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.api_tags import PRODUCT_TAG
from apps.common import errors
from apps.products.models import Product
from apps.products.serializers import ProductSerializer
from apps.products.serializers.product.product_latest import LatestProductSerializer


@extend_schema(
    tags=[PRODUCT_TAG],
    summary=_('List of latest products'),
    description=_('Retrieve a list of the latest products with an option to limit the number of results (10 to 50).'),
    request=ProductSerializer,
    parameters=[
        OpenApiParameter(
            name='limit',
            type=int,
            location=OpenApiParameter.QUERY,
            required=False,
            description=_('The maximum number of products to retrieve, between 10 and 50. Default is 10.'),
            default=10,
        ),
    ],
    responses={
        status.HTTP_200_OK: ProductSerializer(many=True),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description=errors.BAD_REQUEST),
    },
)
class LatestProductListView(ListAPIView):
    serializer_class = LatestProductSerializer
    pagination_class = None
    queryset = (
        Product.objects.prefetch_related('prices', 'product_images', 'prices__currency')
        .filter(active=True)
        .order_by('-created_at')
    )
    permission_classes = (AllowAny,)

    def list(self, request, *args, **kwargs):
        limit = int(request.query_params.get('limit', 10))

        if 10 > limit < 51:
            return Response(
                {'error': 'Invalid limit. It must be between 10 and 50.'}, status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.get_queryset()[:limit]
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

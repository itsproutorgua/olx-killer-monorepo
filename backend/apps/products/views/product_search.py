from django.contrib.postgres.search import SearchVector
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import OpenApiResponse
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet

from apps.api_tags import PRODUCT_TAG
from apps.common import errors
from apps.products.models import Product
from apps.products.pagination import ProductPagination
from apps.products.serializers.product.product_search import ProductSearchSerializer


@extend_schema(
    tags=[PRODUCT_TAG],
    summary=_('Search for advertisements by title'),
    description=_(
        'Search for advertisements by title. Allows filtering by a keyword to retrieve relevant advertisements.'
    ),
    request=ProductSearchSerializer,
    parameters=[
        OpenApiParameter(
            name='q',
            required=True,
            type=str,
            description=_(
                'Retrieve a paginated list of advertisements, sorted by the latest updates and title. '
                'Supports detailed filtering by title. The search query must be at least 3 characters long.'
            ),
        ),
    ],
    responses={
        status.HTTP_200_OK: ProductSearchSerializer(many=True),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description=errors.BAD_REQUEST),
    },
)
class ProductSearchViewSet(ListModelMixin, GenericViewSet):
    queryset = Product.objects
    serializer_class = ProductSearchSerializer
    pagination_class = ProductPagination
    permission_classes = (AllowAny,)
    search_fields = ['title', 'seller__username']

    def get_queryset(self):
        queryset = self.queryset
        search_query = self.request.query_params.get('q', None)

        if search_query and len(search_query) < 3:
            raise ValidationError(_('The search query must be at least 3 characters long.'))

        queryset = (
            queryset.annotate(search=SearchVector('title', 'seller__username'))
            .filter(search__icontains=search_query)
            .select_related(
                'seller',
                'category',
                'seller__profile',
                'seller__profile__location',
                'seller__profile__location__city',
                'seller__profile__location__city__region',
            )
            .prefetch_related(
                'product_images',
                'prices__currency',
                'category__children',
                'category__parent',
                'category__parent__parent',
                'category__parent__parent__parent',
            )
            .order_by('-updated_at', 'title')
        )
        return queryset

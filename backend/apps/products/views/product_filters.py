from django.conf import settings
from django.db.models import F
from django.db.models import OuterRef
from django.db.models import Q
from django.db.models import Subquery
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import OpenApiResponse
from rest_framework import mixins
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.api_tags import PRODUCT_TAG
from apps.common import errors
from apps.products.models import Category
from apps.products.models import Price
from apps.products.models import Product
from apps.products.pagination import ProductPagination
from apps.products.serializers import ProductSerializer


class ProductFilterViewSet(mixins.ListModelMixin, GenericViewSet):
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    permission_classes = (AllowAny,)
    allowed_sort_fields = ['price', 'title', 'created_at']
    default_currency = settings.DEFAULT_CURRENCIES[0]['code']
    queryset = (
        Product.objects.select_related(
            'seller',
            'category',
            'category__parent',
            'category__parent__parent',
            'seller__profile__location__city',
            'seller__profile__location__city__region',
        )
        .prefetch_related(
            'prices',
            'product_images',
            'product_videos',
            'prices__currency',
            'category__children',
        )
        .order_by(f'-{allowed_sort_fields[-1]}')
    )

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Filter products by various parameters'),
        description=_('Retrieve a list of products filtered by multiple parameters'),
        parameters=[
            OpenApiParameter(
                name='category_path',
                type=str,
                description=_('Filter products by category path'),
                required=True,
            ),
            OpenApiParameter(
                name='price_min',
                type=float,
                description=_('Minimum price filter'),
                required=False,
            ),
            OpenApiParameter(
                name='price_max',
                type=float,
                description=_('Maximum price filter'),
                required=False,
            ),
            OpenApiParameter(
                name='currency_code',
                type=str,
                description=_(f'Currency code for the price filter (Default: {default_currency})'),
                required=False,
            ),
            OpenApiParameter(
                name='sort_by',
                type=str,
                description=_(
                    f'Field to sort products by (e.g., {', '.join(allowed_sort_fields)}) '
                    f'followed by ":" and the order ("asc" or "desc"). (Default: {allowed_sort_fields[-1]})'
                ),
                examples=[
                    OpenApiExample(
                        name=_('Sort by price in ascending order'),
                        value='price:asc',
                        description=_('Sort products by price in ascending order.'),
                    ),
                    OpenApiExample(
                        name=_('Sort by price in descending order'),
                        value='price:desc',
                        description=_('Sort products by price in descending order.'),
                    ),
                    OpenApiExample(
                        name=_('Sort by updated date in ascending order'),
                        value='updated_at:asc',
                        description=_('Sort products by updated date in ascending order.'),
                    ),
                    OpenApiExample(
                        name=_('Sort by updated date in descending order'),
                        value='updated_at:desc',
                        description=_('Sort products by updated date in descending order.'),
                    ),
                ],
                required=False,
            ),
        ],
        responses={
            status.HTTP_200_OK: ProductSerializer(many=True),
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(
                description=f'<br>{errors.INVALID_CATEGORY_PATH};<br><br>{errors.INVALID_SORT_FIELD}'
            ),
        },
    )
    def list(self, request):
        queryset = self.queryset

        category_path = request.query_params.get('category_path', None)
        price_min = request.query_params.get('price_min', None)
        price_max = request.query_params.get('price_max', None)
        currency_code = request.query_params.get('currency_code', self.default_currency)

        sort_by = request.query_params.get('sort_by', None)

        # Filters
        if category_path is None:
            return Response({'error': errors.INVALID_CATEGORY_PATH}, status=status.HTTP_400_BAD_REQUEST)

        q1 = Q(category__path=category_path)
        q2 = Q(category__parent__path=category_path)
        q3 = Q(category__parent__parent__path=category_path)
        queryset = queryset.filter(q1 | q2 | q3)

        if price_min is not None:
            queryset = queryset.filter(prices__amount__gte=price_min, prices__currency__code=currency_code).distinct()

        if price_max is not None:
            queryset = queryset.filter(prices__amount__lte=price_max, prices__currency__code=currency_code).distinct()

        # Sorted
        if sort_by:
            try:
                field, order = sort_by.split(':')
                if field not in self.allowed_sort_fields or order not in ['asc', 'desc']:
                    raise ValueError

                order = f'{('', '-')[order == 'desc']}'

                if field == 'price':
                    price_subquery = Price.objects.filter(
                        product=OuterRef('pk'), currency__code=currency_code
                    ).order_by('amount')

                    queryset = queryset.annotate(price_in_currency=Subquery(price_subquery.values('amount')[:1]))
                    queryset = queryset.order_by(f'{order}price_in_currency')
                else:
                    queryset = queryset.order_by(f'{order}{field}')

            except ValueError:
                return Response({'error': errors.INVALID_SORT_FIELD}, status=status.HTTP_400_BAD_REQUEST)

        # Update Category Views
        Category.objects.filter(path=category_path).update(views=F('views') + 1)

        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
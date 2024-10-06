from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiParameter
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from apps.api_tags import PRODUCT_TAG
from apps.common import responses
from apps.common.permissions import IsOwnerOrAdmin
from apps.products.models import Product
from apps.products.serializers import ProductSerializer


class ProductAPIViewSet(ViewSet):
    queryset = Product.objects.all().select_related('seller', 'category')
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return [AllowAny()]

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('List all products'),
        description=_('Retrieve a list of all products'),
        responses={status.HTTP_200_OK: ProductSerializer(many=True)},
    )
    def list(self, request):
        queryset = self.queryset
        paginator = PageNumberPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = self.serializer_class(paginated_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Create a product'),
        description=_('Create a new product with the provided data'),
        request=ProductSerializer,
        responses={
            status.HTTP_201_CREATED: ProductSerializer,
            status.HTTP_400_BAD_REQUEST: responses.BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED: responses.UNAUTHORIZED_ERROR,
            status.HTTP_403_FORBIDDEN: responses.ACCESS_DENIED_ERROR,
        },
    )
    def create(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Retrieve a product'),
        description=_('Retrieve a single product by ID'),
        responses={status.HTTP_200_OK: ProductSerializer, status.HTTP_404_NOT_FOUND: responses.PRODUCT_NOT_FOUND},
    )
    def retrieve(self, request, pk=None):
        product = get_object_or_404(Product, pk=pk)
        serializer = self.serializer_class(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Update a product'),
        description=_('Update a product with the provided data'),
        request=ProductSerializer,
        responses={
            status.HTTP_200_OK: ProductSerializer,
            status.HTTP_400_BAD_REQUEST: responses.BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED: responses.UNAUTHORIZED_ERROR,
            status.HTTP_403_FORBIDDEN: responses.ACCESS_DENIED_ERROR,
        },
    )
    def update(self, request, pk=None):
        product = get_object_or_404(Product, pk=pk)
        serializer = self.serializer_class(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Partial update a product'),
        description=_('Partial update a product with the provided data'),
        request=ProductSerializer,
        responses={
            status.HTTP_200_OK: ProductSerializer,
            status.HTTP_400_BAD_REQUEST: responses.BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED: responses.UNAUTHORIZED_ERROR,
            status.HTTP_403_FORBIDDEN: responses.ACCESS_DENIED_ERROR,
        },
    )
    def partial_update(self, request, pk=None):
        product = get_object_or_404(Product, pk=pk)
        serializer = self.serializer_class(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Delete a product'),
        description=_('Delete a product by ID'),
        responses={
            status.HTTP_204_NO_CONTENT: None,
            status.HTTP_401_UNAUTHORIZED: responses.UNAUTHORIZED_ERROR,
            status.HTTP_403_FORBIDDEN: responses.ACCESS_DENIED_ERROR,
        },
    )
    def destroy(self, request, pk=None):
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Filter products by category ID'),
        description=_('Retrieve a list of products filtered by category'),
        parameters=[
            OpenApiParameter(
                name='category',
                type=int,
                description=_('Filter products by category ID'),
                required=False,
            )
        ],
        responses={
            status.HTTP_200_OK: ProductSerializer(many=True),
            status.HTTP_400_BAD_REQUEST: responses.INVALID_CATEGORY,
        },
    )
    @action(detail=False, methods=['get'], url_path='filters')
    def filter_products(self, request):
        queryset = self.queryset
        category_id = request.query_params.get('category')

        if category_id:
            if not category_id.isdigit():
                return Response({'error': responses.INVALID_CATEGORY}, status=status.HTTP_400_BAD_REQUEST)

            queryset = queryset.filter(category_id=int(category_id))

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

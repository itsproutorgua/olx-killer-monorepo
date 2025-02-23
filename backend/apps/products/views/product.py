from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiResponse
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from apps.api_tags import PRODUCT_TAG
from apps.common import errors
from apps.products.models import Product
from apps.products.serializers import ProductSerializer


class ProductAPIViewSet(ViewSet):
    queryset = Product.objects.all().select_related('seller', 'category').order_by('-updated_at')
    serializer_class = ProductSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated()]
        return [AllowAny()]

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Create a product'),
        description=_('Create a new product with the provided data'),
        request=ProductSerializer,
        responses={
            status.HTTP_201_CREATED: ProductSerializer,
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(description=errors.BAD_REQUEST),
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description=errors.UNAUTHORIZED_ERROR),
            status.HTTP_403_FORBIDDEN: OpenApiResponse(description=errors.ACCESS_DENIED_ERROR),
            status.HTTP_422_UNPROCESSABLE_ENTITY: OpenApiResponse(
                description=(
                    f'<br>{errors.INVALID_IMAGE_TYPE};<br>'
                    f'<br>{errors.INVALID_IMAGE};<br>'
                    f'<br>{errors.IMAGE_SIZE_EXCEEDED}'
                )
            ),
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
        description=_('Retrieve a single product by slug'),
        responses={
            status.HTTP_200_OK: ProductSerializer,
            status.HTTP_404_NOT_FOUND: OpenApiResponse(description=errors.PRODUCT_NOT_FOUND),
        },
    )
    def retrieve(self, request, slug=None):
        product = get_object_or_404(
            Product.objects.select_related(
                'seller',
                'category',
                'category__parent',
                'seller__profile',
                'category__parent__parent',
                'seller__profile__location',
                'seller__profile__location__city',
                'seller__profile__location__city__region',
            ).prefetch_related('product_images', 'prices__currency', 'category__children'),
            slug=str(slug).strip(),
            publication_status=Product.PublicationStatus.ACTIVE,
        )

        session_key = f'viewed_product_{product.id}'

        if not request.session.get(session_key, False):
            Product.objects.filter(id=product.id).update(views=F('views') + 1)
            request.session[session_key] = True

        serializer = self.serializer_class(product)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Update a product'),
        description=_('Update a product with the provided data'),
        request=ProductSerializer,
        responses={
            status.HTTP_200_OK: ProductSerializer,
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(description=errors.BAD_REQUEST),
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description=errors.UNAUTHORIZED_ERROR),
            status.HTTP_403_FORBIDDEN: OpenApiResponse(description=errors.ACCESS_DENIED_ERROR),
            status.HTTP_404_NOT_FOUND: OpenApiResponse(description=errors.PRODUCT_NOT_FOUND),
            status.HTTP_422_UNPROCESSABLE_ENTITY: OpenApiResponse(
                description=(
                    f'<br>{errors.INVALID_IMAGE_TYPE};<br>'
                    f'<br>{errors.IMAGE_SIZE_EXCEEDED}'
                    f'<br>{errors.INVALID_IMAGE};<br>'
                )
            ),
        },
    )
    def update(self, request, slug=None):
        product = get_object_or_404(Product, slug=str(slug).strip())
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
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(description=errors.BAD_REQUEST),
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description=errors.UNAUTHORIZED_ERROR),
            status.HTTP_403_FORBIDDEN: OpenApiResponse(description=errors.ACCESS_DENIED_ERROR),
            status.HTTP_404_NOT_FOUND: OpenApiResponse(description=errors.PRODUCT_NOT_FOUND),
            status.HTTP_422_UNPROCESSABLE_ENTITY: OpenApiResponse(
                description=(
                    f'<br>{errors.INVALID_IMAGE_TYPE};<br>'
                    f'<br>{errors.INVALID_IMAGE};<br>'
                    f'<br>{errors.IMAGE_SIZE_EXCEEDED}'
                )
            ),
        },
    )
    def partial_update(self, request, slug=None):
        product = get_object_or_404(Product, slug=str(slug).strip())
        serializer = self.serializer_class(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_('Delete a product'),
        description=_('Delete a product by slug'),
        responses={
            status.HTTP_204_NO_CONTENT: None,
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description=errors.UNAUTHORIZED_ERROR),
            status.HTTP_403_FORBIDDEN: OpenApiResponse(description=errors.ACCESS_DENIED_ERROR),
            status.HTTP_404_NOT_FOUND: OpenApiResponse(description=errors.PRODUCT_NOT_FOUND),
        },
    )
    def destroy(self, request, slug=None):
        product = get_object_or_404(Product, slug=str(slug).strip())
        product.publication_status = Product.PublicationStatus.DELETED
        product.save(update_fields=('publication_status', 'updated_at'))
        return Response(status=status.HTTP_204_NO_CONTENT)

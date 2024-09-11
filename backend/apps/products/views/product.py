from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from apps.api_tags import PRODUCT_TAG
from apps.common.permissions import ACCESS_DENIED_ERROR
from apps.common.permissions import BAD_REQUEST
from apps.common.permissions import UNAUTHORIZED_ERROR
from apps.products.models import Product
from apps.products.serializers import ProductSerializer


class ProductAPIViewSet(ViewSet):
    queryset = Product.objects.all().select_related("seller", "category")
    serializer_class = ProductSerializer
    permission_classes = (IsAdminUser,)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_("List all products"),
        description=_("Retrieve a list of all products"),
        responses={status.HTTP_200_OK: ProductSerializer(many=True)},
    )
    def list(self, request):
        queryset = self.queryset
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_("Create a product"),
        description=_("Create a new product with the provided data"),
        request=ProductSerializer,
        responses={
            status.HTTP_201_CREATED: ProductSerializer,
            status.HTTP_400_BAD_REQUEST: BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED: UNAUTHORIZED_ERROR,
            status.HTTP_403_FORBIDDEN: ACCESS_DENIED_ERROR,
        },
    )
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_("Retrieve a product"),
        description=_("Retrieve a single product by ID"),
        responses={status.HTTP_200_OK: ProductSerializer},
    )
    def retrieve(self, request, pk=None):
        product = get_object_or_404(Product, pk=pk)
        serializer = self.serializer_class(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=[PRODUCT_TAG],
        summary=_("Update a product"),
        description=_("Update a product with the provided data"),
        request=ProductSerializer,
        responses={
            status.HTTP_200_OK: ProductSerializer,
            status.HTTP_400_BAD_REQUEST: BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED: UNAUTHORIZED_ERROR,
            status.HTTP_403_FORBIDDEN: ACCESS_DENIED_ERROR,
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
        summary=_("Partial update a product"),
        description=_("Partial update a product with the provided data"),
        request=ProductSerializer,
        responses={
            status.HTTP_200_OK: ProductSerializer,
            status.HTTP_400_BAD_REQUEST: BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED: UNAUTHORIZED_ERROR,
            status.HTTP_403_FORBIDDEN: ACCESS_DENIED_ERROR,
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
        summary=_("Delete a product"),
        description=_("Delete a product by ID"),
        responses={
            status.HTTP_204_NO_CONTENT: None,
            status.HTTP_401_UNAUTHORIZED: UNAUTHORIZED_ERROR,
            status.HTTP_403_FORBIDDEN: ACCESS_DENIED_ERROR,
        },
    )
    def destroy(self, request, pk=None):
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

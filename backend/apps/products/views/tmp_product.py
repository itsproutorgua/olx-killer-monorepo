from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api_tags import SERVICE_INFO_TAG
from apps.common import responses
from apps.products.serializers import ProductSerializer
from apps.products.serializers.tmp_product import TMPProductSerializer


class TMPProductCreateAPIView(APIView):
    permission_classes = [
        AllowAny,
    ]

    @extend_schema(
        tags=[SERVICE_INFO_TAG],
        summary='Create a product',
        description='Create a new product with the provided data',
        request=ProductSerializer,
        responses={
            status.HTTP_201_CREATED: ProductSerializer,
            status.HTTP_400_BAD_REQUEST: responses.BAD_REQUEST,
        },
        examples=[
            OpenApiExample(
                'Example Product Creation',
                description='An example of how to create a product',
                value={
                    'cat_id_olx': 123,
                    'title': 'Sample Product',
                    'price': 100.00,
                    'description': 'This is a sample product description.',
                    'images': ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
                    'seller': {'olx_id': 456, 'name': 'John Doe', 'phone_number': '+1234567890'},
                },
                request_only=True,
                response_only=False,
            )
        ],
    )
    def post(self, request, *args, **kwargs):
        serializer = TMPProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

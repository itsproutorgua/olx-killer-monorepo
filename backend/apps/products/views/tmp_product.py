from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api_tags import SERVICE_INFO_TAG
from apps.common import responses
from apps.products.serializers.tmp_product import TMPProductSerializer


class TMPProductCreateAPIView(APIView):
    serializer_class = TMPProductSerializer
    permission_classes = [
        AllowAny,
    ]

    @extend_schema(
        tags=[SERVICE_INFO_TAG],
        summary='Create a product',
        description='Create a new product with the provided data',
        request=TMPProductSerializer,
        responses={
            status.HTTP_201_CREATED: TMPProductSerializer,
            status.HTTP_200_OK: TMPProductSerializer,
            status.HTTP_400_BAD_REQUEST: responses.BAD_REQUEST,
        },
        examples=[
            OpenApiExample(
                'Example Product Creation',
                description='An example of how to create a product',
                value={
                    'cat_id_olx': 123,
                    'prod_olx_id': 5,
                    'title': 'Sample Product',
                    'price_uah': 100.00,
                    'price_usd': 400.00,
                    'description': 'This is a sample product description.',
                    'images': ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
                    'seller': {'user_olx_id': 456, 'name': 'John Doe', 'phone_numbers': ['+1234567890', '+1234567890']},
                },
                request_only=True,
                response_only=False,
            ),
            OpenApiExample(
                name='Successful Product Creation  Response',
                description='Example of a successful response after creating a product.',
                value={
                    'product': {
                        'title': 'Sample Product',
                        'price_uah': '100.00',
                        'price_usd': '400.00',
                        'description': 'This is a sample product description.',
                    },
                    'message': 'The product is created or updated.',
                },
                response_only=True,
            ),
        ],
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            product, created = serializer.save()

            response_data = {
                'product': TMPProductSerializer(product).data,
                'message': 'The product is created.' if created else 'The product has been updated.',
            }

            return Response(response_data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

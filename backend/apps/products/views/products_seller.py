from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.api_tags import PRODUCT_TAG
from apps.common import errors
from apps.products.models import Product
from apps.products.serializers import ProductSerializer
from apps.users.models import Profile


@extend_schema(
    tags=[PRODUCT_TAG],
    summary=_('List of seller products'),
    description=_('Retrieve a list of products associated with a specific seller, identified by their profile ID. Includes related prices, currencies, and product images.'),
    request=None,
    parameters=[
        OpenApiParameter(
            name='q',
            type=str,
            location=OpenApiParameter.QUERY,
            required=True,
            description=_('The ID of the seller\'s profile to filter products.'),
        ),
    ],
    responses={
        status.HTTP_200_OK: ProductSerializer(many=True),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description=errors.BAD_REQUEST),
        status.HTTP_404_NOT_FOUND: OpenApiResponse(description=_('Profile not found for the given ID.')),
    },
)
class ReturnSellerProductsView(ListAPIView):
    queryset = Product.objects
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = self.queryset
        profile_id = self.request.query_params.get('q')

        if not profile_id:
            return Response(
                {'error': _('Profile ID is required.')},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            profile = Profile.objects.get(id=profile_id)
            queryset = Product.objects.prefetch_related('prices__currency', 'product_images').filter(seller=profile.user, 
                                                                                                     publication_status=Product.PublicationStatus.ACTIVE)
        except Profile.DoesNotExist:
            return Response(
                {'error': _('Profile not found for the given ID.')},
                status=status.HTTP_404_NOT_FOUND,
            )

        return queryset
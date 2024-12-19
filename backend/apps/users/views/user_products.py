from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import OpenApiResponse
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from apps.api_tags import PROFILE_TAG
from apps.common import errors
from apps.products.models import Product
from apps.products.pagination import ProductPagination
from apps.users.serializers import UserProductsSerializer


class UserProductsView(ListAPIView):
    pagination_class = ProductPagination
    serializer_class = UserProductsSerializer
    queryset = Product.objects.prefetch_related('prices__currency', 'product_images').order_by('-created_at')

    @extend_schema(
        tags=[PROFILE_TAG],
        summary=_('Retrieve user advertisements'),
        description=_(
            'Retrieve a list of advertisements for the authenticated user. '
            'Optionally filter the advertisements by their active status using the `active` query parameter. '
            'Use `true` for active advertisements, `false` for inactive advertisements. '
            'If no `active` parameter is provided, all advertisements for the user will be returned. '
            'The response will be sorted by the most recently created advertisements first, '
            'and it will be paginated, providing a limited set of advertisements per request.'
        ),
        parameters=[
            OpenApiParameter(
                name='active',
                type=str,
                required=False,
                description=_(
                    'Filter advertisements by their active status. '
                    'Use `true` for active advertisements and `false` for inactive advertisements.'
                ),
            )
        ],
        responses={
            200: UserProductsSerializer,
            400: OpenApiResponse(description=errors.INVALID_PRODUCT_PARAMETERS),
            401: OpenApiResponse(description=errors.USER_UNAUTHORIZED),
            404: OpenApiResponse(description=errors.PRODUCT_NOT_FOUND),
        },
    )
    def get(self, request):
        user = request.user
        active_param = request.query_params.get('active', None)

        if active_param:
            active_param = active_param.lower()
            match active_param:
                case 'true':
                    queryset = self.queryset.filter(seller=user, active=True)
                case 'false':
                    queryset = self.queryset.filter(seller=user, active=False)
                case _:
                    return Response(
                        {'detail': _('Invalid value for active parameter. Use "true" or "false".')},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
        else:
            queryset = self.queryset.filter(seller=user)

        if not queryset.exists():
            active_status = '' if active_param is None else ('inactive', 'active')[active_param == 'true']
            raise NotFound(_(f'This user does\'t have any {active_status} advertisements.'))

        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        products_data = self.get_serializer(queryset, many=True).data

        return Response(products_data, status=status.HTTP_200_OK)

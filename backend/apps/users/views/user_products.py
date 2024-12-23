from django.db.models import Case
from django.db.models import Count
from django.db.models import IntegerField
from django.db.models import QuerySet
from django.db.models import When
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
        },
    )
    def get(self, request):
        user = request.user
        active_param = request.query_params.get('active', '').lower()
        queryset = self.queryset.filter(seller=user)
        advertisement_counts = self.get_advertisement_counts(queryset)

        if active_param:
            if active_param not in ('true', 'false'):
                return Response(
                    {'detail': _("Invalid value for active parameter. Use 'true' or 'false'.")},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            queryset = queryset.filter(active=(active_param == 'true'))

        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            return self.get_paginated_response_data(page, advertisement_counts)

        return Response({**advertisement_counts, 'results': []}, status=status.HTTP_200_OK)

    @staticmethod
    def get_advertisement_counts(queryset: QuerySet) -> dict:
        """
        Get the counts of active and inactive advertisements for a given queryset.

        Args:
            queryset (QuerySet): The queryset to count active and inactive advertisements.

        Returns:
            dict: A dictionary containing counts for total, active, and inactive advertisements.
        """
        advertisement_counts = queryset.aggregate(
            total_active=Count(Case(When(active=True, then=1), output_field=IntegerField())),
            total_inactive=Count(Case(When(active=False, then=1), output_field=IntegerField())),
        )
        return {
            'total_count': advertisement_counts['total_active'] + advertisement_counts['total_inactive'],
            'total_active': advertisement_counts['total_active'],
            'total_inactive': advertisement_counts['total_inactive'],
        }

    def get_paginated_response_data(self, page: list, advertisement_counts: dict) -> dict[str, any]:
        """
        Returns a paginated response with advertisement counts and the paginated list of products.

        Args:
            page (list): The paginated list of products.
            advertisement_counts (dict): The dictionary containing advertisement counts.

        Returns:
            dict: A dictionary with advertisement counts, pagination info, and the product results.
        """
        products_data = self.get_serializer(page, many=True).data
        paginated_response = self.get_paginated_response(products_data)
        paginated_response.data = {
            **advertisement_counts,
            'next': paginated_response.data.get('next'),
            'previous': paginated_response.data.get('previous'),
            'results': paginated_response.data.get('results'),
        }
        return paginated_response

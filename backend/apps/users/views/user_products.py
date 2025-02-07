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
    queryset = Product.objects.prefetch_related('prices__currency', 'product_images').order_by('-updated_at')

    @extend_schema(
        tags=[PROFILE_TAG],
        summary=_('Retrieve user advertisements'),
        description=_(
            'This endpoint retrieves a list of user advertisements (products) with their details. '
            'The publication status defines the visibility of the product: '
            '`Active` means the product is publicly available, `Draft` indicates unpublished items under review, '
            '`Inactive` indicates the product is temporarily hidden,'
            'and `Rejected` represents products that were not approved. '
        ),
        parameters=[
            OpenApiParameter(
                name='publication_status',
                type=str,
                required=False,
                description=_(
                    'Filter products by their publication status. Valid values are: '
                    '`active`, `inactive`, `draft`, and `rejected`. This parameter is optional.'
                ),
            ),
        ],
        responses={
            200: UserProductsSerializer,
            400: OpenApiResponse(description=errors.INVALID_PRODUCT_PARAMETERS),
            401: OpenApiResponse(description=errors.USER_UNAUTHORIZED),
        },
    )
    def get(self, request):
        user = request.user
        queryset = self.queryset.filter(seller=user)

        publication_status = request.query_params.get('publication_status', '').lower().strip()
        advertisement_counts = self.get_advertisement_counts(queryset)

        publication_keys = tuple(dict(Product.PublicationStatus.choices))
        # Фильтрация по publication_status
        if publication_status:
            if publication_status not in publication_keys:
                params_msg = ' | '.join(f'`{key}`' for key in publication_keys)
                error_msg = _(f'Invalid value for publication_status parameter. Use {params_msg}.')
                return Response({'detail': error_msg}, status=status.HTTP_400_BAD_REQUEST)

            queryset = queryset.filter(publication_status=publication_status)

        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            return self.get_paginated_response_data(page, advertisement_counts)

        return Response({**advertisement_counts, 'results': []}, status=status.HTTP_200_OK)

    @staticmethod
    def get_advertisement_counts(queryset: QuerySet) -> dict:
        """
        Calculates the counts of active, inactive, draft, and rejected advertisements
        for a given queryset of products.

        Args:
            queryset (QuerySet): A Django queryset that includes advertisements (products)
                whose publication statuses need to be counted.

        Returns:
            dict: A dictionary containing the following keys:
                - 'total_count': The total number of active and inactive advertisements.
                - 'total_active': The count of active advertisements.
                - 'total_inactive': The count of inactive advertisements.
                - 'total_draft': The count of advertisements in draft status.
                - 'total_rejected': The count of rejected advertisements.

        Example:
            If the queryset contains 5 active, 3 inactive, 2 draft, and 1 rejected advertisements,
            the returned dictionary will be:
            {
                'total_count': 8,
                'total_active': 5,
                'total_inactive': 3,
                'total_draft': 2,
                'total_rejected': 1
            }
        """
        advertisement_counts = queryset.aggregate(
            total_active=Count(
                Case(
                    When(publication_status=Product.PublicationStatus.ACTIVE, then=1),
                    output_field=IntegerField(),
                )
            ),
            total_inactive=Count(
                Case(
                    When(publication_status=Product.PublicationStatus.INACTIVE, then=1),
                    output_field=IntegerField(),
                )
            ),
            total_draft=Count(
                Case(
                    When(publication_status=Product.PublicationStatus.DRAFT, then=1),
                    output_field=IntegerField(),
                )
            ),
            total_rejected=Count(
                Case(
                    When(publication_status=Product.PublicationStatus.REJECTED, then=1),
                    output_field=IntegerField(),
                )
            ),
        )
        total_active = advertisement_counts['total_active']
        total_inactive = advertisement_counts['total_inactive']
        total_draft = advertisement_counts['total_draft']
        total_rejected = advertisement_counts['total_rejected']

        return {
            'total_count': sum([total_active, total_inactive]),
            'total_active': total_active,
            'total_inactive': total_inactive,
            'total_draft': total_draft,
            'total_rejected': total_rejected,
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

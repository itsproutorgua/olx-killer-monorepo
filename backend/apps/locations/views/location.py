from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import OpenApiResponse
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from apps.api_tags import LOCATION_TAG
from apps.locations.models import Location
from apps.locations.serializers.location import LocationSerializer


@extend_schema(
    tags=[LOCATION_TAG],
    summary=_('Retrieve a list of locations'),
    description=_(
        'This endpoint returns a list of locations (cities and villages) ordered alphabetically by city name. '
        'Each location includes its `id`, `name`, `location_type`, `region`, `latitude`, and `longitude`. '
        'You can optionally filter locations by their name using the `location_name` query parameter.'
    ),
    parameters=[
        OpenApiParameter(
            name='location_name',
            type=str,
            description=_('Filter locations by name (supports partial match for city or village names)'),
            required=False,
        ),
    ],
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            response=LocationSerializer(many=True), description=_('A list of locations successfully retrieved.')
        ),
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            response=OpenApiTypes.OBJECT, description=_('Invalid request parameters.')
        ),
        status.HTTP_500_INTERNAL_SERVER_ERROR: OpenApiResponse(
            description=_('An unexpected error occurred on the server.')
        ),
    },
)
class LocationListView(ListAPIView):
    queryset = Location.objects
    serializer_class = LocationSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        language_code = self.request.LANGUAGE_CODE

        # fmt: off
        queryset = (
            self.queryset
            .select_related('city', 'village', 'city__region', 'village__region')
            .order_by(f'city__name_{language_code}')
        )
        # fmt: on
        location_name = self.request.query_params.get('location_name', None)
        if len(location_name) < 3:
            raise ValidationError(_('Location name must be at least 3 characters long.'))

        if location_name:
            city_field_name = f'city__name_{language_code}'
            # village_field_name = f'village__name_{language_code}'

            city_query = Q(**{f'{city_field_name}__startswith': location_name})
            # village_query = Q(**{f'{village_field_name}__startswith': location_name})

            queryset = queryset.filter(city_query)
            # queryset = queryset.filter(city_query | village_query)

        return queryset

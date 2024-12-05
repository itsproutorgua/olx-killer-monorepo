from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.api_tags import FAVORITE_TAG
from apps.favorites.models import Favorite


@extend_schema(
    tags=[FAVORITE_TAG],
    summary=_('Get favorite products count'),
    description=_('Returns the count of favorite products associated with the current authenticated user.'),
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            description=_('Successful response containing the favorite count.'),
            response={
                'type': 'object',
                'properties': {
                    'favorite_count': {
                        'type': 'integer',
                        'example': 5,
                        'description': _('The number of products marked as favorite by the user.'),
                    },
                },
            },
        ),
    },
    examples=[
        OpenApiExample(
            name=_('Example Response'),
            description=_('An example response showing the count of favorite products for the user.'),
            value={'favorite_count': 5},
        ),
    ],
)
class UserFavoriteCountView(APIView):
    """
    API to get the count of favorite products for the current user.
    """

    def get(self, request, *args, **kwargs):
        favorite_count = Favorite.objects.filter(user=request.user).count()
        return Response({'favorite_count': favorite_count}, status=status.HTTP_200_OK)

from apps.users.models import Profile
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiResponse
from apps.api_tags import PROFILE_TAG
from django.utils.translation import gettext_lazy as _



@extend_schema(
    tags=[PROFILE_TAG],
    summary=_('Get user id'),
    description=_("Endpoint for retrieving user id"),
)
class GetUserIdView(APIView):
    @extend_schema(
        operation_id="get_user_id",
        summary=_("Retrieve User ID"),
        description=_("Fetches the user ID associated with the given profile ID."),
        parameters=[
            OpenApiParameter(
                name="profile_id",
                description=_("The ID of the profile whose user ID is to be retrieved."),
                required=True,
                type=int,
            )
        ],
        responses={
            status.HTTP_200_OK: OpenApiResponse(
                response={'user_id': 123}
            )
        },
        examples=[
            OpenApiExample(
                name="Successful Response",
                description="Example of a successful response when the profile ID exists.",
                value={"user_id": 123},
                status_codes=[status.HTTP_200_OK],
            ),
            OpenApiExample(
                name="Profile Not Found",
                description="Example of an error response when the profile ID does not exist.",
                value={"detail": "Not found."},
                status_codes=[status.HTTP_404_NOT_FOUND],
            )
        ]
    )
    def get(self, request, profile_id):
        profile = Profile.objects.select_related('user').get(id=profile_id)
        user_id = profile.user.id
        return Response({'user_id': user_id})
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from rest_framework import response
from rest_framework import status
from rest_framework import views
from rest_framework.permissions import AllowAny

from apps.api_tags import USER_TAG
from apps.common.permissions import BAD_REQUEST
from apps.common.permissions import UNAUTHORIZED_ERROR
from apps.users.serializers import AuthSerializer


class UserRegistrationView(views.APIView):
    permission_classes = [AllowAny]
    serializer_class = AuthSerializer

    @extend_schema(
        tags=[USER_TAG],
        summary=_("Register a new user"),
        description=_("Register a new user using the provided Auth0 token."),
        request=AuthSerializer,
        responses={
            status.HTTP_201_CREATED: AuthSerializer,
            status.HTTP_400_BAD_REQUEST: BAD_REQUEST,
            status.HTTP_401_UNAUTHORIZED: UNAUTHORIZED_ERROR,
        },
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data["auth_token"]
        if "error" in data:
            return response.Response(
                {"error": data["error"]}, status=status.HTTP_400_BAD_REQUEST
            )
        return response.Response(data, status=status.HTTP_201_CREATED)

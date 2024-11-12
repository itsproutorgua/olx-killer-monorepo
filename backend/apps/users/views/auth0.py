from django.conf import settings
from django.http import JsonResponse
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiResponse
from rest_framework import response
from rest_framework import status
from rest_framework import views
from rest_framework.permissions import AllowAny

from apps.api_tags import USER_TAG
from apps.common import errors
from apps.users.serializers import Auth0Serializer
from apps.users.utils import get_or_create_user_from_auth0


MESSAGE_SUCCESS_AUTHENTICATION = _('User authenticated successfully.')
MESSAGE_SUCCESS_REGISTRATION = _('New user registered successfully.')


class Auth0UserView(views.APIView):
    permission_classes = [AllowAny]
    serializer_class = Auth0Serializer

    @extend_schema(
        tags=[USER_TAG],
        summary=_('Authenticate or register a new user'),
        description=_('Authenticate or register a new user using the provided Auth0 token.'),
        request=Auth0Serializer,
        responses={
            status.HTTP_201_CREATED: Auth0Serializer,
            status.HTTP_200_OK: Auth0Serializer,
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(description=errors.BAD_REQUEST),
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(description=errors.UNAUTHORIZED_ERROR),
        },
        examples=[
            OpenApiExample(
                name=_('User authentication or registration example response'),
                description=_('Example of a successful response after user authentication or registration.'),
                value={
                    'message': f'{MESSAGE_SUCCESS_AUTHENTICATION} | {MESSAGE_SUCCESS_REGISTRATION}',
                    'email': 'example@example-email.com',
                    'username': 'example-username',
                    'tokens': {'refresh': 'string', 'access': 'string'},
                },
                response_only=True,
            )
        ],
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        auth0_response = serializer.validated_data['id_token']
        data = get_or_create_user_from_auth0(auth0_response)
        tokens = data.pop('tokens')
        created = data.pop('created')

        if 'error' in data:
            return response.Response({'error': data['error']}, status=status.HTTP_400_BAD_REQUEST)

        data['message'] = MESSAGE_SUCCESS_REGISTRATION if created else MESSAGE_SUCCESS_AUTHENTICATION

        response_data = JsonResponse(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        return self.set_tokens_in_cookie(response_data, tokens)

    @staticmethod
    def set_tokens_in_cookie(response_data: JsonResponse, tokens: dict) -> JsonResponse:
        """
        Sets tokens in cookies with the HttpOnly and Secure flag.
        """
        response_data.set_cookie(
            'access_token', tokens['access'], httponly=True, secure=settings.SECURE_COOKIES, samesite='Strict'
        )
        response_data.set_cookie(
            'refresh_token', tokens['refresh'], httponly=True, secure=settings.SECURE_COOKIES, samesite='Strict'
        )
        return response_data

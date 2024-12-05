from django.contrib.auth import login
from django.http import JsonResponse
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiResponse
from rest_framework import response
from rest_framework import status
from rest_framework import views

from apps.api_tags import USER_TAG
from apps.common.permissions import IsAnonymous
from apps.users.serializers import UserAuthTokenSerializer
from apps.users.utils import get_or_create_user_from_auth0


MESSAGE_SUCCESS_AUTHENTICATION = _('User authenticated successfully.')
MESSAGE_SUCCESS_REGISTRATION = _('New user registered successfully.')


class UserAuthenticationView(views.APIView):
    permission_classes = [IsAnonymous]
    serializer_class = UserAuthTokenSerializer

    @extend_schema(
        tags=[USER_TAG],
        summary=_('Authenticate or register a new user'),
        description=_('Authenticate or register a new user using the provided Auth0 token.'),
        request=UserAuthTokenSerializer,
        responses={
            status.HTTP_201_CREATED: UserAuthTokenSerializer,
            status.HTTP_200_OK: UserAuthTokenSerializer,
            status.HTTP_400_BAD_REQUEST: OpenApiResponse(
                description=_(
                    'Bad Request: Invalid token or other validation error. Example errors: '
                    'Failed to fetch JWKS, Invalid token type, Invalid audience.'
                )
            ),
            status.HTTP_401_UNAUTHORIZED: OpenApiResponse(
                description=_(
                    'Unauthorized: Authentication failed due to invalid or expired token. Example errors: '
                    'Token has expired, Invalid token issuer.'
                )
            ),
        },
        examples=[
            OpenApiExample(
                name=_('User authentication example response'),
                description=_('Example of a successful response after user authentication.'),
                value={
                    'message': f'{MESSAGE_SUCCESS_AUTHENTICATION}',
                    'email': 'example@example-email.com',
                    'username': 'example-username',
                    'last_login': '2024-11-15T14:30:00+03:00',
                },
                response_only=True,
                status_codes=[status.HTTP_200_OK],
            ),
            OpenApiExample(
                name=_('User registration example response'),
                description=_('Example of a successful response after user registration.'),
                value={
                    'message': f'{MESSAGE_SUCCESS_REGISTRATION}',
                    'email': 'example@example-email.com',
                    'username': 'example-username',
                    'last_login': '2024-11-15T14:30:00+03:00',
                },
                response_only=True,
                status_codes=[status.HTTP_201_CREATED],
            ),
            OpenApiExample(
                name=_('Error response example'),
                description=_('Example of an error response when authentication fails.'),
                value={
                    'error': _('Invalid token'),
                },
                response_only=True,
                status_codes=[status.HTTP_400_BAD_REQUEST],
            ),
        ],
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        auth0_response = serializer.validated_data['id_token']
        data = get_or_create_user_from_auth0(auth0_response)
        created = data.pop('created')
        user = data.pop('user')

        if 'error' in data:
            return response.Response({'error': data['error']}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)

        data = {
            'email': user.email,
            'username': user.username,
            'last_login': user.last_login,
            'message': MESSAGE_SUCCESS_REGISTRATION if created else MESSAGE_SUCCESS_AUTHENTICATION,
        }

        return JsonResponse(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

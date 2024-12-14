from django.db import transaction
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiResponse
from rest_framework import generics
from rest_framework import mixins
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from apps.users.models import Profile
from apps.users.serializers import ProfileSerializer


@extend_schema(
    tags=['Profiles'],
    summary=_('User profile management'),
    description=_('Endpoint for managing the current user\'s profile, including retrieval, updating, and deletion.'),
)
class ProfileRetrieveUpdateDeleteView(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView,
):
    queryset = Profile.objects.select_related('user').all()
    serializer_class = ProfileSerializer

    def get_object(self):
        obj = self.queryset.filter(user=self.request.user).first()
        if not obj:
            raise PermissionDenied(_('Profile not found or access denied.'))
        return obj

    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise PermissionDenied(_('You do not have permission to edit this profile.'))
        serializer.save()

    def perform_destroy(self, instance):
        with transaction.atomic():
            instance.user.delete()

    @extend_schema(
        summary=_('Retrieve user profile'),
        description=_('Retrieve the profile of the currently authenticated user.'),
        responses={
            status.HTTP_200_OK: OpenApiResponse(
                response=ProfileSerializer,
                examples=[
                    OpenApiExample(
                        _('Example profile response'),
                        value={
                            'id': 1,
                            'picture': 'path/to/profile_picture.jpg',
                            'username': 'john_doe',
                            'first_name': 'John',
                            'last_name': 'Doe',
                            'email': 'email@example.com',
                            'phone_numbers': ['+380504567891', '+380931234567'],
                            'location': {
                                'id': 1,
                                'name': 'Kyiv',
                                'location_type': 'city',
                                'region': 'Kyiv City',
                                'latitude': 50.4501,
                                'longitude': 30.5234,
                            },
                            'created_at': '2023-08-10T14:48:00Z',
                            'updated_at': '2023-08-15T08:35:00Z',
                        },
                    )
                ],
            )
        },
    )
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @extend_schema(
        summary=_('Update user profile'),
        description=_('Update the profile of the currently authenticated user.'),
        responses={status.HTTP_200_OK: ProfileSerializer},
        examples=[
            OpenApiExample(
                _('Complete profile update example'),
                value={
                    'first_name': 'John',
                    'last_name': 'Doe',
                    'picture': '<binary file>',
                    'username': 'john_doe',
                    'phone_numbers': ['+380504567891', '80671239846'],
                    'location_id': 1,
                },
                request_only=True,
            )
        ],
    )
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @extend_schema(
        summary=_('Partially update user profile'),
        description=_('Partially update the profile of the currently authenticated user.'),
        responses={status.HTTP_200_OK: ProfileSerializer},
        examples=[
            OpenApiExample(
                _('Partial profile update example'),
                value={
                    'phone_numbers': ['0679155723'],
                    'location_id': 17,
                },
                request_only=True,
            )
        ],
    )
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    @extend_schema(
        summary=_('Delete user profile'),
        description=_('Delete the profile of the currently authenticated user.'),
        responses={status.HTTP_204_NO_CONTENT: None},
    )
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

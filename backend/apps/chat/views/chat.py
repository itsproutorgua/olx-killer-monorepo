from django.db.models import Q, OuterRef, Subquery, DateTimeField, Value
from django.db.models.functions import Coalesce
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError, PermissionDenied

from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from apps.chat.serializers.chat import ChatReceiveSerializer, ChatRoomCreateSerializer
from apps.users.models.profile import Profile
from apps.users.authentication import Auth0JWTAuthentication


@extend_schema(
    tags=['Chat'],
    summary='Create a chat room',
    description='Creates a chat room for two users based on their profile IDs.',
    responses={
        201: OpenApiResponse(
            description='Chat room created successfully.',
            response=ChatRoomCreateSerializer,
        ),
        400: OpenApiResponse(description='Invalid profile IDs provided.'),
        401: OpenApiResponse(description='User is unauthorized.'),
    },
)
class ChatRoomCreateView(CreateAPIView):
    serializer_class = ChatRoomCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self) -> dict:
        return {
            **super().get_serializer_context(),
            'first_profile_id': self.request.GET.get('first_profile_id'),
            'second_profile_id': self.request.GET.get('second_profile_id'),
        }


@extend_schema(
    tags=['Chat'],
    summary='Delete a chat room',
    description='Deletes a chat room by its ID.',
    responses={
        204: OpenApiResponse(description='Chat room deleted successfully.'),
        401: OpenApiResponse(description='User is unauthorized.'),
        404: OpenApiResponse(description='Chat room not found.'),
    },
)
class ChatRoomDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ChatRoom.objects.all()


@extend_schema(
    tags=['Chat'],
    summary='Retrieve user chats',
    description='Retrieves a list of chat rooms for a user, sorted by the most recent message.',
    parameters=[
        OpenApiParameter(
            name='profile_id',
            type=int,
            required=True,
            description='ID of the profile to retrieve chats for.',
        ),
    ],
    responses={
        200: OpenApiResponse(
            description='List of chats retrieved successfully.',
            response=ChatReceiveSerializer(many=True),
        ),
        401: OpenApiResponse(description='User is unauthorized or token does not match profile.'),
        400: OpenApiResponse(description='Invalid profile ID provided.'),
    },
)
class ChatsReceiveView(ListAPIView):
    serializer_class = ChatReceiveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile_id = self.request.GET.get('profile_id')
        try:
            profile = Profile.objects.get(id=profile_id)
        except Profile.DoesNotExist:
            raise ValidationError(f"Profile with ID {profile_id} does not exist")

        last_message_subquery = (
            Message.objects.filter(chat_room=OuterRef('pk'))
            .order_by('-created_at')
            .values('created_at')[:1]
        )

        return (
            ChatRoom.objects.filter(Q(first_user=profile.user) | Q(second_user=profile.user))
            .select_related('first_user__profile', 'second_user__profile')
            .annotate(
                last_message_time=Coalesce(
                    Subquery(last_message_subquery, output_field=DateTimeField()),
                    Value('1970-01-01 00:00:00', output_field=DateTimeField()),
                )
            )
            .order_by('-last_message_time')
        )

    def get_serializer_context(self) -> dict:
        return {
            **super().get_serializer_context(),
            'profile_id': self.request.GET.get('profile_id'),
            'token': self.request.headers.get('Authorization', ''),
        }

    def get(self, request, *args, **kwargs):
        profile_id = self.request.GET.get('profile_id')
        token = self.request.headers.get('Authorization', '')

        if not token.startswith('Bearer '):
            raise PermissionDenied("Invalid or missing authorization token")

        try:
            profile_id = int(profile_id)
        except (TypeError, ValueError):
            raise ValidationError("Profile ID must be a valid integer")

        try:
            auth0_auth = Auth0JWTAuthentication()
            validated_token = auth0_auth.get_validated_token(token[7:])  # Remove 'Bearer ' prefix
            user = auth0_auth.get_user(validated_token)
            profile = Profile.objects.get(user=user)
        except Exception as e:
            raise PermissionDenied("Invalid token or user authentication failed") from e

        if profile.id != profile_id:
            raise PermissionDenied("Token must belong to the user associated with the provided profile ID")

        return super().list(request, *args, **kwargs)
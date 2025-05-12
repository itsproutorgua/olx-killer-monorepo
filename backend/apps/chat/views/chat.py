from django.db.models import OuterRef
from django.db.models import Q
from django.db.models import Subquery, DateTimeField, Value
from django.db.models.functions import Coalesce
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import OpenApiResponse
from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated

from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from apps.chat.serializers.chat import ChatReceiveSerializer
from apps.chat.serializers.chat import ChatRoomCreateSerializer
from apps.users.models.profile import Profile


@extend_schema(
    tags=['Chat'],
    summary='Create chat room',
    description='This endpoint create chat room for two users.',
)
class ChatRoomCreateView(CreateAPIView):
    serializer_class = ChatRoomCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update(
            {
                'first_profile_id': self.request.GET.get('first_profile_id'),
                'second_profile_id': self.request.GET.get('second_profile_id'),
            }
        )
        return context

    @extend_schema(
        tags=['Chat'],
        summary='Create users chat room and retrieve room id',
        description='This endpoint retrieves a list of chats for the user.',
        parameters=[
            OpenApiParameter(
                name='first_profile_id',
                type=int,
                required=True,
                description='first user profile id.',
            ),
            OpenApiParameter(
                name='second_profile_id',
                type=int,
                required=True,
                description='second user profile id.',
            ),
        ],
        responses={
            200: OpenApiResponse(
                description='Chat room created successfully.',
                response=ChatRoomCreateSerializer,
            ),
            401: OpenApiResponse(description='User unauthorized.'),
        },
    )
    def post(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

@extend_schema(
    tags=['Chat'],
    summary='Delete chatroom',
    description='This endpoint delete user`s chat.',
)
class ChatRoomDeleteView(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ChatRoom.objects.all()


@extend_schema(
    tags=['Chat'],
    summary='Retrieve user chats',
    description='This endpoint retrieves a list of chats for the user.',
)
class ChatsReceiveView(ListAPIView):
    serializer_class = ChatReceiveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile_id = self.request.GET.get('profile_id')
        profile = Profile.objects.filter(id=profile_id).first()
        last_message_subquery = (
            Message.objects.filter(chat_room=OuterRef('pk')).order_by('-created_at').values('created_at')[:1]
        )

        return (
            ChatRoom.objects.filter(Q(first_user=profile.user) | Q(second_user=profile.user))
            .annotate(last_message_time=Coalesce(
                Subquery(last_message_subquery, output_field=DateTimeField()), 
                Value('1970-01-01 00:00:00', output_field=DateTimeField())))
            .order_by('-last_message_time')
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({'profile_id': self.request.GET.get('profile_id')})
        return context
    
    @extend_schema(
        tags=['Chat'],
        summary='Retrieve user chats',
        description='This endpoint retrieves a list of chats for the user.',
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
                response=ChatReceiveSerializer,
            ),
            401: OpenApiResponse(description='User unauthorized.'),
        },
    )
    def get(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

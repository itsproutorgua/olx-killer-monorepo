from django.db.models import OuterRef
from django.db.models import Q
from django.db.models import Subquery
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiParameter
from drf_spectacular.utils import OpenApiResponse

from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from apps.chat.serializers.chat import ChatReceiveSerializer
from apps.users.models.profile import Profile

@extend_schema(
    tags=['Chat'],
    summary='Retrieve user chats',
    description='This endpoint retrieves a list of chats for the user.',)
class ChatsReceiveView(ListModelMixin, GenericViewSet):
    serializer_class = ChatReceiveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile_id = self.request.GET.get('profile_id')
        profile = Profile.objects.filter(id=profile_id).first()
        last_message_subquery = (
            Message.objects.filter(chat_room=OuterRef('pk')).order_by('created_at').values('created_at')[:1]
        )

        return (
            ChatRoom.objects.filter(Q(first_user=profile.user) | Q(second_user=profile.user))
            .annotate(last_message_time=Subquery(last_message_subquery))
            .order_by('last_message_time')
        )
    
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
    def list(self, request, *args, **kwargs):
        profile_id = request.GET.get('profile_id')

        queryset = self.get_queryset()
        pag_queryset = self.paginate_queryset(queryset)

        serializer = self.get_serializer(pag_queryset, many=True, context={'profile_id': profile_id})

        return self.get_paginated_response(serializer.data)

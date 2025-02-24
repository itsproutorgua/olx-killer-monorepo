from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.generics import CreateAPIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from apps.chat.models.chat import ChatRoom
from apps.chat.serializers.chat import ChatCreateSerializer
from apps.chat.serializers.chat import ChatRetrieveSerialzier


User = get_user_model()


@extend_schema(
    tags=['Chat'],
)
class ChatRoomCreateView(CreateAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatCreateSerializer
    permission_classes = [IsAuthenticated]


@extend_schema(
    tags=['Chat'],
)
class ChatRoomRetrieveView(RetrieveAPIView):
    serializer_class = ChatRetrieveSerialzier
    permission_classes = [IsAuthenticated]

    def get_object(self):
        first_user = self.request.query_params.get('first_user')
        second_user = self.request.query_params.get('second_user')

        room = ChatRoom.objects.filter(
            Q(first_user=first_user, second_user=second_user) | Q(first_user=second_user, second_user=first_user)
        )

        return get_object_or_404(room)

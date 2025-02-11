from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models.chat import ChatRoom
from ..serializers.chat import ChatSerializer


User = get_user_model()


class ChatRoomView(ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path=r'(?P<userid1>\d+)/(?P<userid2>\d+)')
    def get_or_create_room(self, request, userid1, userid2):
        user1 = get_object_or_404(User, id=userid1)
        user2 = get_object_or_404(User, id=userid2)
        print(user1, user2)

        room, created = self.queryset.get_or_create(first_user=user1, second_user=user2)

        return Response({'room_id': room.id})

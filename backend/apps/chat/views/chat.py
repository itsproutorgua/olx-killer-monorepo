from rest_framework.viewsets import ModelViewSet
from ..serializers.chat import ChatSerializer
from ..models.chat import ChatRoom
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatViewSet(ModelViewSet):
    serializer_class = ChatSerializer
    queryset = ChatRoom.objects.all()
    
    def create(self, request, *args, **kwargs):
        user1 = request.user
        user2_id = request.data.get('user_id')
        user2 = get_object_or_404(User, id=user2_id)
        
        room = ChatRoom.objects.filter(users=user1).filter(users=user2).filter(room_type="private").first()
        if not room:
            room = ChatRoom.objects.create()
            room.users.add(user1, user2)
        
        return Response({"room_id": room.id}, status=status.HTTP_201_CREATED)
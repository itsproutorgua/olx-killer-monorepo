from apps.chat.seializers.chat import ChatRecieveSerializer
from django.db.models import OuterRef, Subquery, Q
from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated


class ChatRecieveView(ListModelMixin, GenericViewSet):
    serializer_class = ChatRecieveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.GET.get('first_user')
        last_message_subquery = Message.objects.filter(
            chat_room=OuterRef('pk')
        ).order_by('created_at').values('created_at')[:1]

        return ChatRoom.objects.filter(
            Q(first_user=user) | Q(second_user=user)
        ).annotate(
            last_message_time=Subquery(last_message_subquery)
        ).order_by('last_message_time')


from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiExample
from drf_spectacular.utils import OpenApiResponse
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.chat.models.chat import ChatRoom
from apps.chat.serializers.chat import ChatSerializer


User = get_user_model()


@extend_schema(
    tags=['Chat'],
)
class ChatRoomView(CreateAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary=_('Get or create chat room'),
        description=_('Get or create a chat room between two users.'),
        responses={
            200: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                examples=[
                    OpenApiExample(
                        _('Chat room created example'),
                        value={
                            'room_id': 1,
                        },
                    )
                ],
            )
        },
        examples=[
            OpenApiExample(
                _('Get or create chat room example'),
                value={
                    'userid1': 1,
                    'userid2': 2,
                },
                request_only=True,
            )
        ],
    )
    def post(self, request):
        user_id_1 = request.data.get('first_user')
        user_id_2 = request.data.get('second_user')
        user1 = get_object_or_404(User, id=user_id_1)
        user2 = get_object_or_404(User, id=user_id_2)

        room = ChatRoom.objects.filter(
            Q(first_user=user1, second_user=user2) | Q(first_user=user2, second_user=user1)
        ).first()

        if room is None:
            room = ChatRoom.objects.create(first_user=user1, second_user=user2)

        serialized_data = self.serializer_class(room).data

        return Response({'room_data': serialized_data}, status=200)

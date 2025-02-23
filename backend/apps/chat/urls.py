from django.urls import path

from apps.chat.views.chat import ChatRoomView


app_name = 'chat'

urlpatterns = [
    path('chat-rooms/get_or_create_room/', ChatRoomView.as_view(), name='get_or_create_room'),
]

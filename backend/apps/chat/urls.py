from django.urls import path

from apps.chat.views.chat import ChatRoomCreateView
from apps.chat.views.chat import ChatRoomDeleteView
from apps.chat.views.chat import ChatsReceiveView


app_name = 'chat'

urlpatterns = [
    path('chat/recieve/', ChatsReceiveView.as_view(), name='chat-recieve'),
    path('chat/create/', ChatRoomCreateView.as_view(), name='chatroom-create'),
    path('chat/delete/<int:pk>', ChatRoomDeleteView.as_view(), name='chatroom-delete'),
]

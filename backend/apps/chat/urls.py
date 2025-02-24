from django.urls import path

from apps.chat.views.chat import ChatRoomCreateView
from apps.chat.views.chat import ChatRoomRetrieveView


app_name = 'chat'


urlpatterns = [
    path('chat-rooms/create/', ChatRoomCreateView.as_view(), name='create-room'),
    path('chat-rooms/retrieve/', ChatRoomRetrieveView.as_view(), name='retrieve-room'),
]

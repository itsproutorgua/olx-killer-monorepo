from django.urls import path

from apps.chat.views.chat import ChatsReceiveView


app_name = 'chat'

urlpatterns = [path('chat/recieve/', ChatsReceiveView.as_view({'get': 'list'}), name='chat-recieve')]

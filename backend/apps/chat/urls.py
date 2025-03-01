from django.urls import path
from apps.chat.views.chat import ChatRecieveView

app_name = 'chat'

urlpatterns = [
    path('chat/recieve/', ChatRecieveView.as_view({'get': 'list'}), name='chat-recieve')
]
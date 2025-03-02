from django.urls import path

from apps.chat.consumers.consumers import ChatConsumer


websocket_urlpatterns = [
    path('ws/chat/', ChatConsumer.as_asgi()),
]

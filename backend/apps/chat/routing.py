from django.urls import path

from apps.chat.consumers.consumers import ChatConsumer
from apps.chat.consumers.notification_consumer import NotificationConsumer


websocket_urlpatterns = [
    path('ws/chat/', ChatConsumer.as_asgi()),
    path('ws/chat/notifications/', NotificationConsumer.as_asgi()),
]

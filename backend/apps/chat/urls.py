from django.urls import include
from django.urls import path
from rest_framework.routers import SimpleRouter

from apps.chat.views.chat import ChatRoomView
from apps.chat.views.message import DeleteMessageView
from apps.chat.views.message import EditMessageView


router = SimpleRouter()
router.register(r'chat-rooms', ChatRoomView)


app_name = 'chat'

urlpatterns = [
    path('', include(router.urls)),
    path('messages/<int:message_id>/delete/', DeleteMessageView.as_view(), name='delete_message'),
    path('messages/<int:message_id>/edit/', EditMessageView.as_view(), name='edit_message'),
]

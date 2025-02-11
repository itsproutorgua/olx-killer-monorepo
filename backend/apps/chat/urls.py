from django.urls import include
from django.urls import path
from rest_framework.routers import SimpleRouter

from .views.chat import ChatRoomView


router = SimpleRouter()
router.register(r'chat-rooms', ChatRoomView)


app_name = 'chat'

urlpatterns = [
    path('', include(router.urls)),
]

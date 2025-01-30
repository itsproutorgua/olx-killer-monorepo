from django.contrib import admin
from ..models.chat import ChatRoom
from ..models.message import Message


admin.site.register(ChatRoom)
admin.site.register(Message)


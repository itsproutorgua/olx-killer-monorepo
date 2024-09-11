from django.contrib import admin

from apps.user_messages.models import MessageImage


class MessageImageInline(admin.TabularInline):
    model = MessageImage
    extra = 1

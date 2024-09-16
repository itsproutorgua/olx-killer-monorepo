from django.contrib import admin

from apps.user_messages.admin.inlines import MessageImageInline
from apps.user_messages.models import Message


@admin.register(Message)
class UserMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'parent', 'is_read')
    list_display_links = ('id', 'sender', 'recipient', 'parent')
    inlines = [MessageImageInline]
    queryset = Message.objects

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.select_related('sender', 'recipient', 'parent')

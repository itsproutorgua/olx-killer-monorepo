from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from simple_history.admin import SimpleHistoryAdmin

from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message


@admin.register(ChatRoom)
class ChatRoomAdmin(SimpleHistoryAdmin):
    fieldsets = (
        (None, {'fields': ('first_user', 'second_user')}),
        (_('Important dates'), {'fields': ('created_at', 'updated_at')}),
    )
    list_display = ('id', 'first_user', 'second_user', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    list_display_links = ('id', 'first_user', 'second_user')
    show_full_result_count = False

    search_fields = [
        'first_user__email',
        'second_user__email',
    ]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('first_user', 'second_user').order_by('-created_at')

    def get_history_queryset(self, request, history_manager, pk_name: str, object_id):
        qs = super().get_history_queryset(request, history_manager, pk_name, object_id)
        return qs.prefetch_related('history_user')


@admin.register(Message)
class MessageAdmin(SimpleHistoryAdmin):
    fieldsets = (
        (None, {'fields': ('chat_room', 'sender', 'text')}),
        (_('Important dates'), {'fields': ('created_at', 'updated_at')}),
    )
    list_display = ('id', 'chat_room', 'sender', 'text', 'created_at', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    list_display_links = ('id', 'chat_room', 'sender')
    show_full_result_count = False

    search_fields = [
        'sender__email',
    ]

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('chat_room', 'sender').order_by('-created_at')

    def get_history_queryset(self, request, history_manager, pk_name: str, object_id):
        qs = super().get_history_queryset(request, history_manager, pk_name, object_id)
        return qs.prefetch_related('history_user')

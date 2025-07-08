from collections import Counter
from apps.chat.models.message import Message
from apps.users.models.profile import Profile
from apps.chat.models.useractivity import UserActivity
from channels.db import database_sync_to_async
from django.db.models import Q


class Notification:
    
    @staticmethod
    @database_sync_to_async
    def _get_msg_data(user):
        """
        Fetches unread message counts and latest message details for a user across chat rooms.
        Queries unread messages, groups by room, and returns aggregated data with sender info.

        Args:
            user: User object to query unread messages for.

        Returns:
            dict: Contains total unread count and per-room message details.
        """
        # Query unread messages (DELIVERED) for user, with related chat_room and sender
        msgs = Message.objects.filter(
            Q(chat_room__first_user=user) | Q(chat_room__second_user=user),
            status=Message.Status.DELIVERED  
        ).select_related('chat_room', 'sender')
        
        

        # Count total unread messages
        all_unreaded = len(msgs)
        # Group unread messages by chat room ID
        count_by_room = Counter(msg.chat_room.id for msg in msgs)

        return_data = []

        for key, value in count_by_room.items():
            # Fetch latest message in room, with related chat_room and sender
            last_message_in_room = Message.objects.filter(chat_room__id=key).select_related(
                'chat_room', 'sender'
            ).order_by("-created_at").first()
            
            # Get sender's profile for latest message
            sender = Profile.objects.filter(user=last_message_in_room.sender).first()

            activity = UserActivity.objects.get(user=sender.user)

            # Append room-specific message data
            return_data.append({
                "counter_by_room": value,
                "created_at": last_message_in_room.created_at.isoformat(),
                "updated_at": last_message_in_room.updated_at.isoformat(),
                "last_message": last_message_in_room.text,
                "status": last_message_in_room.status,
                "sender_id": sender.id,
                'sender_status': activity.status,
                "room_id": key
            })
        
        # Return aggregated results
        return {
            "counter": all_unreaded,
            "messages": return_data
        }

    @staticmethod
    async def get_notifications(user):
        return await Notification._get_msg_data(user)
    
    @staticmethod
    async def _send_notification(consumer, send_to):
        notification_group_name = f'notifications_{send_to.id}'
        data = await Notification._get_msg_data(send_to)

        await consumer.channel_layer.group_send(notification_group_name, {'type': 'notify', 'messages': data})
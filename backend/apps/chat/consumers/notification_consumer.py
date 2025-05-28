import json
from channels.generic.websocket import AsyncWebsocketConsumer
from apps.chat.utils.users import UserUtils
from apps.chat.utils.notification import Notification
from channels.exceptions import DenyConnection

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """
        Establishes a WebSocket connection for receiving notifications.
        """
        # Authenticate the user based on the WebSocket scope
        self.scope["first_user"] = await UserUtils.authenticate_user(self.scope)
        if not self.scope["first_user"]:
            # Deny connection if authentication fails
            raise DenyConnection(code=4001, reason="Authentication failed")

        # Store the user ID and create a unique notification group name
        self.user_id = self.scope["first_user"].id
        self.notification_group_name = f"notifications_{self.user_id}"
        # Add this consumer instance to the user's notification group
        await self.channel_layer.group_add(self.notification_group_name, self.channel_name)

        # Accept the WebSocket connection with Bearer token authentication
        await self.accept("Bearer")

        # Retrieve notifications for the authenticated user
        msgs = await Notification.get_notifications(self.scope["first_user"])
        
        # Send the initial set of notifications to the client
        await self.send(text_data=json.dumps({
             'type': 'notify', 
             'messages': msgs, 
             },
            ensure_ascii=False
        ))

    async def disconnect(self, code):
        """
        Handles disconnection of the WebSocket.
        """
        # Remove this consumer from the notification group upon disconnection
        await self.channel_layer.group_discard(self.notification_group_name, self.channel_name)
        # Call the parent class's disconnect method
        return super().disconnect(code)

    async def notify(self, event):
        """
        Processes incoming notification events and forwards them to the client.
        """
        # Send the notification data to the client via WebSocket
        await self.send(text_data=json.dumps(event["messages"]))

    async def receive(self, text_data=None):
        """
        Handles incoming messages from the WebSocket client.
        Currently, no custom handling is implemented, so it delegates to the parent class.
        """
        return super().receive(text_data)
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db.models import Q
from django.db.utils import IntegrityError
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed

from apps.chat.exceptions.exceptions import DatabaseIntegrityError
from apps.chat.exceptions.exceptions import InvalidTokenFormatError
from apps.chat.exceptions.exceptions import MalformedAuthorizationHeaderError
from apps.chat.models.chat import ChatRoom
from apps.chat.models.message import Message
from apps.chat.models.useractivity import UserActivity
from apps.users.authentication import Auth0JWTAuthentication
from apps.users.models import User


async def update_user_status(user: User, is_online: bool) -> None:
    status = UserActivity.Status.ONLINE if is_online else UserActivity.Status.OFFLINE

    await sync_to_async(
        lambda: UserActivity.objects.update_or_create(
            user=user,
            defaults={'status': status, 'last_seen': timezone.now()},
        ),
        thread_sensitive=True,
    )()


async def authenticate_user(scope: dict) -> User:
    subprotocols = scope.get('subprotocols', [])
    token = None
    if subprotocols[0] == 'Bearer':
        token = subprotocols[1]
    if not token:
        return None

    auth0_auth = Auth0JWTAuthentication()
    try:
        validated_token = auth0_auth.get_validated_token(token)
        return await sync_to_async(auth0_auth.get_user)(validated_token)
    except AuthenticationFailed:
        raise
    except AttributeError:
        raise InvalidTokenFormatError()
    except IndexError:
        raise MalformedAuthorizationHeaderError()
    except IntegrityError:
        raise DatabaseIntegrityError()


async def validate_user_id(consumer: AsyncWebsocketConsumer) -> None:
    first_user_id = consumer.scope['first_user_id']
    first_user = consumer.scope['first_user']

    first_user_id = await sync_to_async(lambda: User.objects.get(id=first_user_id))()

    if first_user != first_user_id:
        await consumer.close()


async def is_vaild_sender(message_id: int, sender_id: int) -> bool:
    message = Message.objects.filter(id=message_id).first()
    sender = User.objects.filter(id=sender_id).first()

    if message.sender != sender:
        return False
    return True


async def get_recipient(room: ChatRoom, user: User) -> User:
    return await sync_to_async(lambda: room.get_recipient(user))()


async def get_chat_room(room_id: int) -> int:
    return await sync_to_async(lambda: ChatRoom.objects.filter(id=room_id).first())()


async def is_user_online(user: User) -> bool:
    return await sync_to_async(
        lambda: UserActivity.objects.filter(user=user, status=UserActivity.Status.ONLINE).exists()
    )()


async def create_or_get_room(first_user_email: str, second_user_id: int) -> int:
    first_user = await sync_to_async(lambda: User.objects.get(email=first_user_email))()
    second_user = await sync_to_async(lambda: User.objects.get(id=second_user_id))()

    room = await sync_to_async(
        lambda: ChatRoom.objects.filter(
            Q(first_user=first_user, second_user=second_user) | Q(first_user=second_user, second_user=first_user)
        ).first()
    )()

    if room:
        return room.id

    room = await sync_to_async(lambda: ChatRoom.objects.create(first_user=first_user, second_user=second_user))()

    return room.id

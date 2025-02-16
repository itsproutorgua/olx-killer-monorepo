from asgiref.sync import sync_to_async
from django.utils import timezone
from models.chat import ChatRoom
from models.useractivity import UserActivity
from rest_framework.exceptions import AuthenticationFailed

from apps.users.authentication import Auth0JWTAuthentication


async def update_user_status(user, is_online):
    status = UserActivity.Status.ONLINE if is_online else UserActivity.Status.OFFLINE

    await sync_to_async(
        lambda: UserActivity.objects.update_or_create(
            user=user,
            defaults={'status': status, 'last_seen': timezone.now()},
        ),
        thread_sensitive=True,
    )()


async def get_chat_room(room_id):
    return await sync_to_async(lambda: ChatRoom.objects.filter(id=room_id).first(), thread_sensitive=True)()


async def authenticate_user(scope):
    headers = dict(scope.get('headers'))
    token = headers.get(b'authorization', b'').decode('utf-8').split(' ')[1] if b'authorization' in headers else None

    if not token:
        return None

    auth0_auth = Auth0JWTAuthentication()
    try:
        validated_token = auth0_auth.get_validated_token(token)
        return await sync_to_async(auth0_auth.get_user)(validated_token)
    except AuthenticationFailed:
        return None


async def is_user_in_chat(room_id, user_email):
    users = await sync_to_async(
        lambda: list(
            ChatRoom.objects.select_related('first_user', 'second_user')
            .filter(id=room_id)
            .values_list('first_user__email', 'second_user__email')
        ),
        thread_sensitive=True,
    )()

    return bool(users) and user_email in users[0]


async def get_recipient(room, user):
    return await sync_to_async(lambda: room.get_recipient(user))()


async def is_user_online(user):
    return await sync_to_async(
        lambda: UserActivity.objects.filter(user=user, status=UserActivity.Status.ONLINE).exists()
    )()

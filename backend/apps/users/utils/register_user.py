from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


def register_user(email, username, email_verified, picture):
    user, created = User.objects.get_or_create(email=email)

    if created:
        user.username = username
        user.email_verified = email_verified
        user.picture = picture
        user.set_password(User.objects.make_random_password())
        user.save()

    tokens = get_jwt_tokens(user)

    return {
        "email": user.email,
        "username": user.username,
        "tokens": tokens,
    }


def get_jwt_tokens(user):
    refresh = RefreshToken.for_user(user)
    refresh["role"] = user.role

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }

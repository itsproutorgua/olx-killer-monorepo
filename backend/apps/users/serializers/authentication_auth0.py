from django.conf import settings
from rest_framework import serializers

from apps.users.utils import validate_auth0_token


class UserAuthTokenSerializer(serializers.Serializer):
    id_token = serializers.CharField()

    @staticmethod
    def validate_id_token(id_token: str) -> dict[str, any]:
        return validate_auth0_token(id_token, settings.AUTH0_DOMAIN)

from django.conf import settings
from rest_framework import serializers

from apps.common.utils import validate_auth0_token


class UserAuthTokenSerializer(serializers.Serializer):
    id_token = serializers.CharField()

    @staticmethod
    def validate_id_token(id_token: str) -> dict[str, any]:
        auth0_domain = settings.AUTH0_DOMAIN
        return validate_auth0_token(id_token, auth0_domain)

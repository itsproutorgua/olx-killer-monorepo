import jwt
import requests
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed


class UserAuthTokenSerializer(serializers.Serializer):
    id_token = serializers.CharField()

    def validate_id_token(self, id_token: str) -> dict[str, any]:
        auth0_domain = settings.AUTH0_DOMAIN
        return self.validate_auth0_token(id_token, auth0_domain)

    @staticmethod
    def validate_auth0_token(id_token: str, auth0_domain: str) -> dict[str, any]:
        jwks_url = f'https://{auth0_domain}/.well-known/jwks.json'

        try:
            jwks = requests.get(jwks_url).json()
        except requests.exceptions.RequestException as e:
            raise AuthenticationFailed(_(f'Failed to fetch JWKS: {e}'))
            # Get the kid (Key ID) from the header of the JWT
        header = jwt.get_unverified_header(id_token)

        kid = header['kid']
        # Find the key with the matching kid
        rsa_key = {}
        for key in jwks['keys']:
            if key['kid'] == kid:
                rsa_key = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e'],
                }
                break

        if not rsa_key:
            raise AuthenticationFailed(_('Unable to find the appropriate key.'))
            # Decode the token using the fetched public key
        try:
            decoded_token = jwt.decode(id_token, options={'verify_signature': False})
            if 'scope' in decoded_token:
                raise AuthenticationFailed(_('Invalid token type: Expected id_token, received access_token'))
            return decoded_token
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed(_('Token has expired'))
        except jwt.InvalidAudienceError:
            raise AuthenticationFailed(_('Invalid token audience'))
        except jwt.InvalidIssuerError:
            raise AuthenticationFailed(_('Invalid token issuer'))
        except jwt.DecodeError:
            raise AuthenticationFailed(_('Error decoding token'))
        except jwt.InvalidTokenError:
            raise AuthenticationFailed(_('Invalid token'))

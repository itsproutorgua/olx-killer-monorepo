import jwt
import requests
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from apps.users.utils import register_user


class AuthSerializer(serializers.Serializer):
    auth_token = serializers.CharField()

    def validate_auth_token(self, auth_token):
        auth0_domain = settings.AUTH0_DOMAIN
        auth0_response = self.validate_auth0_token(auth_token, auth0_domain)

        email = auth0_response.get("email")
        username = auth0_response.get("nickname")
        email_verified = auth0_response.get("email_verified")
        picture = auth0_response.get("picture")

        return register_user(
            email=email,
            username=username,
            email_verified=email_verified,
            picture=picture,
        )

    def validate_auth0_token(self, auth_token, auth0_domain):
        jwks_url = f"https://{auth0_domain}/.well-known/jwks.json"

        try:
            jwks = requests.get(jwks_url).json()
        except requests.exceptions.RequestException as e:
            raise AuthenticationFailed(_(f"Failed to fetch JWKS: {e}"))
            # Get the kid (Key ID) from the header of the JWT
        header = jwt.get_unverified_header(auth_token)
        kid = header["kid"]
        # Find the key with the matching kid
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == kid:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
            if not rsa_key:
                raise AuthenticationFailed(_("Unable to find the appropriate key."))
                # Decode the token using the fetched public key
            try:
                decoded_token = jwt.decode(
                    auth_token, options={"verify_signature": False}
                )
                return decoded_token
            except jwt.ExpiredSignatureError:
                raise AuthenticationFailed(_("Token has expired"))
            except jwt.InvalidAudienceError:
                raise AuthenticationFailed(_("Invalid token audience"))
            except jwt.InvalidIssuerError:
                raise AuthenticationFailed(_("Invalid token issuer"))
            except jwt.DecodeError:
                raise AuthenticationFailed(_("Error decoding token"))
            except jwt.InvalidTokenError:
                raise AuthenticationFailed(_("Invalid token"))

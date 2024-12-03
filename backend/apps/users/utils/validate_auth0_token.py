import jwt
import requests
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import AuthenticationFailed


def validate_auth0_token(id_token: str, auth0_domain: str) -> dict[str, any]:
    jwks_url = f'https://{auth0_domain}/.well-known/jwks.json'

    try:
        jwks = requests.get(jwks_url).json()
    except requests.exceptions.RequestException as e:
        raise AuthenticationFailed(_(f'Failed to fetch JWKS: {e}'))

    header = jwt.get_unverified_header(id_token)
    kid = header.get('kid')
    if not kid:
        raise AuthenticationFailed(_('Invalid token'))

    rsa_key = next(
        (
            {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e'],
            }
            for key in jwks['keys']
            if key['kid'] == kid
        ),
        None,
    )

    if not rsa_key:
        raise AuthenticationFailed(_('Unable to find the appropriate key.'))

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

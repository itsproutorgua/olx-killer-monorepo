from rest_framework import status
from rest_framework.exceptions import APIException


class InvalidTokenFormatError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid token format.'
    default_code = 'invalid_token_format'


class MalformedAuthorizationHeaderError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Malformed authorization header.'
    default_code = 'malformed_authorization_header'


class DatabaseIntegrityError(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'Database integrity error during authentication.'
    default_code = 'database_integrity_error'

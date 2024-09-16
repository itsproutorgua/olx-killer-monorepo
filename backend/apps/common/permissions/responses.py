from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import OpenApiResponse


UNAUTHORIZED_ERROR = OpenApiResponse(description=_('Unauthorized'))
ACCESS_DENIED_ERROR = OpenApiResponse(description=_('Access denied'))
BAD_REQUEST = OpenApiResponse(description=_('Validation errors'))
NOT_FOUND = OpenApiResponse(description=_('Not found'))

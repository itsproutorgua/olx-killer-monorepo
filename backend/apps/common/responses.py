from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import OpenApiResponse


UNAUTHORIZED_ERROR = OpenApiResponse(description=_('Unauthorized'))
ACCESS_DENIED_ERROR = OpenApiResponse(description=_('Access denied'))
BAD_REQUEST = OpenApiResponse(description=_('Validation errors'))
INVALID_CATEGORY = OpenApiResponse(description=_('Invalid category ID'))
CATEGORY_NOT_FOUND = OpenApiResponse(description=_('Category not found'))
PRODUCT_NOT_FOUND = OpenApiResponse(description=_('Product not found'))

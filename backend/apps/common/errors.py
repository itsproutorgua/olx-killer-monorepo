from django.conf import settings
from django.utils.translation import gettext_lazy as _


# Common
UNAUTHORIZED_ERROR = _('Unauthorized')
ACCESS_DENIED_ERROR = _('Access denied')
BAD_REQUEST = _('Validation errors')

# Category
INVALID_CATEGORY_PATH = _('Invalid category path')
CATEGORY_NOT_FOUND = _('Category not found')
QUERY_PARAMS_NOT_ALLOWED = _('Query parameters are not allowed on this endpoint.')

# Product
PRODUCT_NOT_FOUND = _('No Advertisement matches the given query.')
INVALID_SORT_FIELD = _('Invalid sort field.')
INVALID_PRODUCT_STATUS = _('Invalid advertisement status. Allowed values are `used` and `new`.')
INVALID_PRODUCT_PARAMETERS = _('Invalid parameters.')

# Deactivated Feedback
FEEDBACK_PERMISSION_ERROR = _('You do not have permission to provide feedback for this product.')

# Image
INVALID_IMAGE_TYPE = _('Invalid file type. Allowed types: %s') % ', '.join(settings.ALLOWED_IMAGE_MIME_TYPES)
INVALID_IMAGE = _('Uploaded file is not a valid image.')
IMAGE_SIZE_EXCEEDED = _('The image size cannot exceed %s MB.') % settings.MAX_IMAGE_FILE_SIZE_MB
INVALID_COUNT_IMAGE = _(f'You can upload a maximum of {settings.MAX_COUNT_IMAGE_FILES} images.')

# Video
INVALID_VIDEO_TYPE = _('Invalid video type. Allowed types: %s') % ', '.join(settings.ALLOWED_VIDEO_MIME_TYPES)
VIDEO_SIZE_EXCEEDED = _('The video size cannot exceed %s MB.') % settings.MAX_VIDEO_FILE_SIZE_MB
PRODUCT_VIDEO_LIMIT = _(f'Each product can have only {settings.VIDEO_UPLOAD_LIMIT} video.')
INVALID_VIDEO = _('Uploaded file is not a valid video.')

# Users
USER_UNAUTHORIZED = _('Authentication credentials were not provided.')

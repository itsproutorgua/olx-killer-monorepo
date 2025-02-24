from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiResponse
from rest_framework import status
from rest_framework.generics import CreateAPIView

from apps.api_tags import PRODUCT_TAG
from apps.common import errors
from apps.products.models.deactivate_feedback import ProductDeactivationFeedback
from apps.products.serializers.product.deactivated_feedback import DeactivatedProductFeedbackSerializer


@extend_schema(
    tags=[PRODUCT_TAG],
    summary=_('Submit product deactivation feedback'),
    description=_('Creates a new feedback record about product deactivation, including sale status and reason.'),
    request=DeactivatedProductFeedbackSerializer,
    responses={
        status.HTTP_201_CREATED: DeactivatedProductFeedbackSerializer,
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(description=errors.BAD_REQUEST),
        status.HTTP_403_FORBIDDEN: OpenApiResponse(description=errors.FEEDBACK_PERMISSION_ERROR),
    },
)
class ProductDeactivationFeedbackCreateView(CreateAPIView):
    queryset = ProductDeactivationFeedback.objects.all()
    serializer_class = DeactivatedProductFeedbackSerializer

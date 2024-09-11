from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import extend_schema_view
from rest_framework import mixins
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import GenericViewSet

from apps.api_tags import CATEGORY_TAG
from apps.common.permissions import NOT_FOUND
from apps.products.models import Category
from apps.products.serializers import CategorySerializer


@extend_schema_view(
    list=extend_schema(
        tags=[CATEGORY_TAG],
        summary=_("List all categories"),
        description=_("Retrieve a list of all categories"),
        responses={
            status.HTTP_200_OK: CategorySerializer(many=True),
        },
    ),
    retrieve=extend_schema(
        tags=[CATEGORY_TAG],
        summary=_("Retrieve a category by ID"),
        description=_("Retrieve a single category by ID"),
        responses={
            status.HTTP_200_OK: CategorySerializer,
            status.HTTP_404_NOT_FOUND: NOT_FOUND,
        },
    ),
)
class CategoryAPIViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet
):
    queryset = Category.objects.all().select_related("parent")
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)

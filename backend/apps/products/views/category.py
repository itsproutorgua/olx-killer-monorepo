from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import extend_schema_view
from drf_spectacular.utils import OpenApiParameter
from rest_framework import mixins
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.api_tags import CATEGORY_TAG
from apps.common import responses
from apps.common.utils import get_sort_field_by_language
from apps.products.models import Category
from apps.products.serializers import CategorySerializer


@extend_schema_view(
    list=extend_schema(
        tags=[CATEGORY_TAG],
        summary=_('List all categories'),
        description=_('Retrieve a list of all categories'),
        responses={
            status.HTTP_200_OK: CategorySerializer(many=True),
        },
    ),
    retrieve=extend_schema(
        tags=[CATEGORY_TAG],
        summary=_('Retrieve a category by ID'),
        description=_('Retrieve a single category by ID'),
        responses={
            status.HTTP_200_OK: CategorySerializer,
            status.HTTP_404_NOT_FOUND: responses.CATEGORY_NOT_FOUND,
        },
    ),
)
class CategoryAPIViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    queryset = Category.objects.all().select_related('parent')
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        queryset = self.queryset
        sort_field = get_sort_field_by_language(model=Category, base_field_name='title', fallback_language='uk')

        return queryset.order_by(sort_field)

    @extend_schema(
        tags=[CATEGORY_TAG],
        summary=_('List root categories'),
        description=_('Retrieve a list of root categories (where parent is None)'),
        responses={status.HTTP_200_OK: CategorySerializer(many=True)},
    )
    @action(detail=False, methods=['get'], url_path='roots')
    def list_root_categories(self, request):
        """Получить категории, у которых родитель None"""
        root_categories = self.get_queryset().filter(parent__isnull=True)
        serializer = self.get_serializer(root_categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=[CATEGORY_TAG],
        summary=_('List child categories'),
        description=_('Retrieve a list of child categories by parent ID'),
        parameters=[
            OpenApiParameter(name='parent_id', description=_('ID of the parent category'), required=True, type=int)
        ],
        responses={
            status.HTTP_200_OK: CategorySerializer(many=True),
            status.HTTP_404_NOT_FOUND: responses.INVALID_PARENT_CATEGORY,
        },
    )
    @action(detail=False, methods=['get'], url_path='children')
    def list_child_categories(self, request):
        """Получить категории, у которых родитель имеет указанный ID"""
        parent_id = request.query_params.get('parent_id')
        if not parent_id or not parent_id.isdigit():
            return Response({'error': responses.INVALID_PARENT_CATEGORY}, status=status.HTTP_400_BAD_REQUEST)

        child_categories = self.get_queryset().filter(parent_id=int(parent_id))
        serializer = self.get_serializer(child_categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

from django.conf import settings
from django.core.cache import cache
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils.translation import get_language
from django.utils.translation import gettext_lazy as _
from drf_spectacular.utils import extend_schema
from drf_spectacular.utils import OpenApiResponse
from rest_framework import mixins
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.api_tags import CATEGORY_TAG
from apps.common import errors
from apps.common.utils import get_sort_field_by_language
from apps.products.models import Category
from apps.products.serializers import CategorySerializer


class CategoryAPIViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    serializer_class = CategorySerializer
    permission_classes = (AllowAny,)
    queryset = Category.objects.all().select_related('parent').prefetch_related('children')
    lookup_field = 'path'

    def get_queryset(self):
        queryset = self.queryset
        sort_field = get_sort_field_by_language(model=Category, base_field_name='title', fallback_language='uk')

        return queryset.order_by(sort_field)

    @extend_schema(
        tags=[CATEGORY_TAG],
        summary=_('List categories in a tree structure'),
        description=_('Retrieve a hierarchical tree of categories.'),
        responses={
            status.HTTP_200_OK: CategorySerializer(many=True),
        },
    )
    def list(self, request, *args, **kwargs):
        language = get_language()
        cache_key = f'category_tree_{language}'
        category_tree = cache.get(cache_key)

        if not category_tree:
            category_tree = Category.get_categories_tree()
            cache.set(cache_key, category_tree, timeout=settings.CATEGORY_TREE_CACHE_TIMEOUT)

        return Response(category_tree, status=status.HTTP_200_OK)

    @extend_schema(
        tags=[CATEGORY_TAG],
        summary=_('Retrieve a category by path'),
        description=_('Retrieve a single category by path'),
        responses={
            status.HTTP_200_OK: CategorySerializer,
            status.HTTP_404_NOT_FOUND: OpenApiResponse(description=errors.CATEGORY_NOT_FOUND),
        },
    )
    def retrieve(self, request, path=None):
        category = get_object_or_404(Category, path=path.strip('/'))
        Category.objects.filter(id=category.id).update(views=F('views') + 1)
        serializer = self.serializer_class(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

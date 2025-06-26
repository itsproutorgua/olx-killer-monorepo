from apps.products.search.documents import ProductDocument
from apps.products.serializers.product.product import ProductSerializer
from apps.products.models.product import Product
from rest_framework.permissions import AllowAny

from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from rest_framework.pagination import PageNumberPagination
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    CompoundSearchFilterBackend,
)
from django_elasticsearch_dsl_drf.constants import (
    LOOKUP_FILTER_TERMS,
    LOOKUP_FILTER_RANGE,
    LOOKUP_FILTER_PREFIX,
    LOOKUP_FILTER_WILDCARD,
)

class SearchProductView(DocumentViewSet):
    document = ProductDocument
    serializer_class = ProductSerializer
    pagination_class = PageNumberPagination
    permission_classes= [AllowAny]

    filter_backends = [
        FilteringFilterBackend,
        CompoundSearchFilterBackend,
    ]

    search_fields = ('title', 'description')
    multi_match_search_fields = ('title^2', 'description')
    filter_fields = {
        'title': 'title',
        'description': 'description',
    }

    def get_queryset(self):
        q = self.request.GET.get("query", "")
        if q:
            search = ProductDocument.search().query(
                "multi_match", query=q, fields=["title^2", "description"]
            )
            product_ids = [hit.meta.id for hit in search]
            return Product.objects.filter(id__in=product_ids).order_by('id')
        return Product.objects.none()
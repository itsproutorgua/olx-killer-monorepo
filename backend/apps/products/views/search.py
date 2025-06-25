from apps.products.search.documents import ProductDocument
from rest_framework.generics import ListAPIView
from apps.products.serializers.product.product import ProductSerializer


class SearchProductView(ListAPIView):

    serializer_class=ProductSerializer

    def get_queryset(self):
        q = self.request.GET.get("query", "")
        if q:
            search = (ProductDocument.search()
                      .query('multi-match', query=q, fields=["title^2", "description"]))
            response = search.execute()
            return response
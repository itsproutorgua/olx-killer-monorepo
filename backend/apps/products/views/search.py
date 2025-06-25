from apps.products.search.documents import ProductDocument
from elasticsearch.dsl.query import MultiMatch
from rest_framework.generics import ListAPIView


class SearchProductView(ListAPIView):
    def get_queryset(self):
        q = self.request.GET.get("query", "")
        if q:
            query = MultiMatch(query=q, fields=["title^3", 
                                                "description^2", 
                                                "category_title^2", 
                                                "category_parent_title^1"])
            search = ProductDocument.search().query(query)
            return search
from apps.products.search.documents import ProductDocument
from elasticsearch.dsl.query import MultiMatch
from rest_framework.generics import ListAPIView


class SearchProductView(ListAPIView):
    def get_queryset(self):
        q = self.request.GET.get("query", "")
        if q:
            query = MultiMatch(query=q, fields=["title", 
                                                "description", 
                                                "category_title", 
                                                "category_parent_title"])
            search = ProductDocument.search().query(query)
            return search
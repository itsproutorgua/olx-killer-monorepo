from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry

from apps.products.models.product import Product

@registry.register_document
class ProductDocument(Document):
    class Index:
        name = "products"
        settings = {"number_of_shards": 1, "number_of_replicas": 0}

    class Django:
        model = Product
        fields = ["title", "description"]

    def prepare_category_title(self, instance):
        return instance.category.title
    
    def prepare_category_parent_title(self, instance):
        return instance.category.parent.title
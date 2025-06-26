from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from apps.products.models.product import Product

@registry.register_document
class ProductDocument(Document):
    title = fields.TextField(analyzer="standard")
    description = fields.TextField(analyzer="standard")
    
    class Index:
        name = "products"
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 1
        }

    class Django:
        model = Product
        fields = []

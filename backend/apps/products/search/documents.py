from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from apps.products.models.product import Product

@registry.register_document
class ProductDocument(Document):
    title = fields.TextField(analyzer="multilang_analyzer")
    description = fields.TextField(analyzer="multilang_analyzer")

    class Index:
        name = "products"
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 1,
            'analysis': {
                'analyzer': {
                    'multilang_analyzer': {
                        'type': 'custom',
                        'tokenizer': 'standard',
                        'char_filter': ['html_strip'],  
                        'filter': [
                            'lowercase',
                            'russian_stop',
                            'ukrainian_stop',
                            'english_stop',
                            'russian_stemmer',
                            'english_stemmer'
                        ]
                    }
                },
                'filter': {
                    'russian_stop': {'type': 'stop', 'stopwords': '_russian_'},
                    'ukrainian_stop': {'type': 'stop', 'stopwords': '_ukrainian_'},
                    'english_stop': {'type': 'stop', 'stopwords': '_english_'},
                    'russian_stemmer': {'type': 'stemmer', 'language': 'russian'},
                    'english_stemmer': {'type': 'stemmer', 'language': 'english'}
                }
            }
        }

    class Django:
        model = Product
        fields = []
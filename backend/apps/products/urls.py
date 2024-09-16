from rest_framework import routers

from apps.products import views


app_name = 'api_products'

router = routers.DefaultRouter()
router.register('categories', views.CategoryAPIViewSet, basename='category')
router.register('products', views.ProductAPIViewSet, basename='product')

urlpatterns = []

urlpatterns += router.urls

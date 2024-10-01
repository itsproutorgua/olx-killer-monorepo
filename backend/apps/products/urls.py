from django.urls import path
from rest_framework import routers

from apps.products import views


app_name = 'api_products'

router = routers.DefaultRouter()
router.register('categories', views.CategoryAPIViewSet, basename='category')
router.register('products', views.ProductAPIViewSet, basename='product')

urlpatterns = [
    path('create-temp-product/', views.TMPProductCreateAPIView.as_view(), name='create_temp_product'),
]

urlpatterns += router.urls

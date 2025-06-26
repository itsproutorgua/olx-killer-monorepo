from django.urls import path
from rest_framework import routers

from apps.products import views


app_name = 'api_products'

router = routers.DefaultRouter()
router.register('categories', views.CategoryAPIViewSet, basename='category')
router.register('products', views.ProductAPIViewSet, basename='products')
router.register(r'products/search', views.ProductSearchViewSet, basename='search')


urlpatterns = [
    path('products/filters/', views.ProductFilterViewSet.as_view({'get': 'list'}), name='product-filter'),
    path('products/latest/', views.LatestProductListView.as_view(), name='latest-products'),
    path('search/', views.SearchProductView.as_view({'get': 'list'}), name='search-products'),
    path('products/feedback/', views.ProductDeactivationFeedbackCreateView.as_view(), name='deactivated-feedback'),
    path('categories/<path:path>/', views.CategoryAPIViewSet.as_view({'get': 'retrieve'}), name='category-detail'),
    path('currencies/', views.CurrencyListView.as_view(), name='currency-list'),
    path('create-temp-product/', views.TMPProductCreateAPIView.as_view(), name='create-temp-product'),
]

urlpatterns += router.urls

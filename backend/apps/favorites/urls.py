from django.urls import path
from rest_framework import routers

from apps.favorites import views


app_name = 'api_favorites'

router = routers.DefaultRouter()
router.register('favorites', views.FavoriteViewSet, basename='favorites')

urlpatterns = [
    path('favorites/user-favorite-count/', views.UserFavoriteCountView.as_view(), name='user-favorite-count'),
]

urlpatterns += router.urls

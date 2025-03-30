from django.urls import path

from apps.users import views


app_name = 'api_users'

urlpatterns = [
    path('users/profile/', views.ProfileRetrieveUpdateDeleteView.as_view(), name='profile'),
    path('users/profile/products/', views.UserProductsView.as_view(), name='user-products'),
    path('users/profile/getuserid/<int:profile_id>/', views.GetUserIdView.as_view(), name='get-user-id'),
]

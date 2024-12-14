from django.urls import path

from apps.users import views


app_name = 'api_users'

urlpatterns = [
    path('users/profile/', views.ProfileRetrieveUpdateDeleteView.as_view(), name='profile'),
]

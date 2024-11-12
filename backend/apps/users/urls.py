from django.urls import path

from apps.users import views


app_name = 'api_users'

urlpatterns = [
    path('auth0-user/', views.Auth0UserView.as_view(), name='auth0-user'),
]

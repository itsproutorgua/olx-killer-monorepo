from django.urls import path

from apps.users import views


app_name = 'api_users'

urlpatterns = [
    path('users/authentication/', views.UserAuthenticationView.as_view(), name='user-authentication'),
]

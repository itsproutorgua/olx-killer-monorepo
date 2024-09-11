from django.urls import path

from apps.users import views


app_name = "api_users"

urlpatterns = [
    path("registration/", views.UserRegistrationView.as_view(), name="registration"),
]

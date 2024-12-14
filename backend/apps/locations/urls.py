from django.urls import path

from apps.locations import views


app_name = 'locations'

urlpatterns = [
    path('locations/', views.LocationListView.as_view(), name='locations-list'),
]

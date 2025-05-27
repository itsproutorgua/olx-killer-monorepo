from django.urls import path
from apps.sendpulse.views.views import SaveElectronInkData


app_name = 'sendpulse'

urlpatterns = [
    path('save/electronink/', SaveElectronInkData.as_view(), name="save_data_from_electronink")
]
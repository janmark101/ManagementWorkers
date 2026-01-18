from django.urls import path
from .views import FCMDeviceView

urlpatterns = [
    path('devices/', FCMDeviceView.as_view()),
]
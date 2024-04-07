from django.urls import path
from .views import TeamMessagesView


urlpatterns = [
    path('team/<int:pk>/',TeamMessagesView.as_view()),
]

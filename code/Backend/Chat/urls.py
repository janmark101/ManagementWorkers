from django.urls import path
from .views import TeamMessagesView



# urlpatterns = [
#     path('team/<int:pk>/',TeamMessagesView.as_view()),
# ]

from django.urls import path
from . import views

urlpatterns = [
    path('team/<int:pk>/',TeamMessagesView.as_view()),
    path("", views.lobby)
]
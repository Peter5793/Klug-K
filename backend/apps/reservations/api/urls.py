from django.urls import path

from .views import ReservationsPlaceholderView

urlpatterns = [
    path("", ReservationsPlaceholderView.as_view(), name="reservations"),
]

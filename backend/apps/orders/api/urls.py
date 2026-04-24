from django.urls import path

from .views import OrdersPlaceholderView

urlpatterns = [
    path("", OrdersPlaceholderView.as_view(), name="orders"),
]

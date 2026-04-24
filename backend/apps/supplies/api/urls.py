from django.urls import path

from .views import SuppliesPlaceholderView

urlpatterns = [
    path("", SuppliesPlaceholderView.as_view(), name="supplies"),
]

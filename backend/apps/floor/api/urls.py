from django.urls import path

from .views import FloorLayoutPlaceholderView

urlpatterns = [
    path("layouts/", FloorLayoutPlaceholderView.as_view(), name="floor-layouts"),
]

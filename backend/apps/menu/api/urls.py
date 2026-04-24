from django.urls import path

from .views import MenuItemsPlaceholderView, MenuUploadsPlaceholderView

urlpatterns = [
    path("items/", MenuItemsPlaceholderView.as_view(), name="menu-items"),
    path("uploads/", MenuUploadsPlaceholderView.as_view(), name="menu-uploads"),
]

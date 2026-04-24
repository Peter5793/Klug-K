from django.urls import path

from .views import DashboardSummaryPlaceholderView

urlpatterns = [
    path("summary/", DashboardSummaryPlaceholderView.as_view(), name="dashboard-summary"),
]

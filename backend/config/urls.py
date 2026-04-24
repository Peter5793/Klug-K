from django.urls import include, path

urlpatterns = [
    path("api/health/", include("apps.common.api.urls")),
    path("api/dashboard/", include("apps.dashboard.api.urls")),
    path("api/menu/", include("apps.menu.api.urls")),
    path("api/orders/", include("apps.orders.api.urls")),
    path("api/reservations/", include("apps.reservations.api.urls")),
    path("api/supplies/", include("apps.supplies.api.urls")),
    path("api/floor/", include("apps.floor.api.urls")),
]

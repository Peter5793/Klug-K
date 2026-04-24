from rest_framework.permissions import BasePermission


class RestaurantScopedPermission(BasePermission):
    message = "Restaurant membership validation must be implemented against restaurant_users."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

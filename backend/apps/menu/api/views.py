from apps.common.api.placeholders import PlaceholderAPIView


class MenuItemsPlaceholderView(PlaceholderAPIView):
    message = "Menu item APIs will be restaurant-scoped and derive costs from supplies in the backend."


class MenuUploadsPlaceholderView(PlaceholderAPIView):
    message = "Menu upload review APIs will expose AI extraction results without auto-overwriting production data."

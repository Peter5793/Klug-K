from apps.common.api.placeholders import PlaceholderAPIView


class SuppliesPlaceholderView(PlaceholderAPIView):
    message = "Supply APIs are the single backend source for unit prices used in menu cost derivation."

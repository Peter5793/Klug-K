from apps.common.api.placeholders import PlaceholderAPIView


class OrdersPlaceholderView(PlaceholderAPIView):
    message = "Orders APIs will infer restaurant scope from authenticated membership, not from client input."

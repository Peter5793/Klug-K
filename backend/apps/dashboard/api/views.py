from apps.common.api.placeholders import PlaceholderAPIView


class DashboardSummaryPlaceholderView(PlaceholderAPIView):
    message = "Dashboard summary will be backed by derived order, reservation, and menu costing queries."

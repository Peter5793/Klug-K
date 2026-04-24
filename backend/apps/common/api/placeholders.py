from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class PlaceholderAPIView(APIView):
    message = "Implementation pending exact Supabase schema mapping."

    def get(self, request: Request) -> Response:
        return Response({"detail": self.message}, status=status.HTTP_501_NOT_IMPLEMENTED)

    def post(self, request: Request) -> Response:
        return Response({"detail": self.message}, status=status.HTTP_501_NOT_IMPLEMENTED)

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response


class IsAuthenticatedView(APIView):

    def get(self, request):
        if request.user.is_anonymous:
            return Response({"result": False}, status=status.HTTP_404_NOT_FOUND)
        return Response({"result": True}, status=status.HTTP_202_ACCEPTED)

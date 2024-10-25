from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import json


class IsAuthenticatedView(APIView):

    def get(self, request):
        if request.user.is_anonymous:
            return Response({"result": False}, status=status.HTTP_404_NOT_FOUND)
        return Response({"result": True}, status=status.HTTP_202_ACCEPTED)


class ReadVersinAPIView(APIView):

    def get(self, request):
        with open("version.json", "r") as server_file:
            server_data = json.load(server_file)
        with open("frontend/package.json", "r") as frontend_file:
            frontend_data = json.load(frontend_file)
        return Response(
            {
                "serverVersion": server_data["version"],
                "frontendVersion": frontend_data["version"],
            }
        )

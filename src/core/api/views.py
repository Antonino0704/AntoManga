from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from config import settings
import json
import os
from core.minxins import DeprecatedAPIMixin
from series.api.serializers import ImageSeriesSerializer


class ReadVersionAPIView(APIView):

    def get(self, request):
        with open(
            f"{settings.BASE_DIR}/version.json",
            "r",
        ) as server_file:
            server_data = json.load(server_file)
        with open(
            f"{settings.BASE_DIR}/frontend/package.json",
            "r",
        ) as frontend_file:
            frontend_data = json.load(frontend_file)
        return Response(
            {
                "backendVersion": server_data["version"],
                "frontendVersion": frontend_data["version"],
            }
        )


class getLicenseView(APIView):

    def get(self, request):
        with open(f"{os.path.dirname(settings.BASE_DIR)}/LICENSE", "r") as license:
            return Response(license.read())


class validateImage(APIView):

    def post(self, request):
        serializer = ImageSeriesSerializer(data=request.data)
        return Response({"isValid": serializer.is_valid()})

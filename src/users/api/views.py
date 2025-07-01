from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from users.api.serializers import UserSerializer
from django.contrib.auth.models import User


class UserView(APIView):

    def get(self, request):
        serializer = UserSerializer(self.request.user)
        return Response(serializer.data, status=status.HTTP_202_ACCEPTED)

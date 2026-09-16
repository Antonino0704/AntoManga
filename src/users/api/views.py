from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from users.api.serializers import (
    UserSerializer,
    TicketSerializer,
    LabelSerializer,
    AvatarProfileSerializer,
)
from users.models import Label, Profile
from django.contrib.auth.models import User


class UserView(APIView):

    def get(self, request):
        serializer = UserSerializer(self.request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        if "username" in self.request.data:
            serializer = UserSerializer(
                self.request.user, data={"username": request.data["username"]}
            )
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"updated": serializer.is_valid()}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"updated": serializer.is_valid()}, status=status.HTTP_409_CONFLICT
                )
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        serializer = UserSerializer(self.request.user)
        if serializer.data.get("is_staff"):
            return Response(
                {"protectedErrorDetail": "You are staff account"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = UserSerializer(
            self.request.user, data={"is_active": False}, partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class TicketView(generics.CreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        if self.request.user.is_anonymous:
            serializer.save()
        else:
            serializer.save(author=self.request.user)


class LabelView(generics.ListAPIView):
    queryset = Label.objects.all()
    serializer_class = LabelSerializer
    pagination_class = None


class AvatarProfilView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = AvatarProfileSerializer(
            Profile.objects.get_or_create(user=request.user)[0]
        )
        return Response(serializer.data)

    def put(self, request):
        profile = Profile.objects.get_or_create(user=request.user)[0]
        serializer = AvatarProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"updated": True}, status=status.HTTP_200_OK)
        return Response({"updated": False}, status=status.HTTP_400_BAD_REQUEST)

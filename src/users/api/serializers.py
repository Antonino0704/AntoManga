from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import Ticket, Label, Profile


class UserSerializer(serializers.ModelSerializer):
    is_authenticated = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["username", "is_authenticated", "is_staff", "is_active"]

    def get_is_authenticated(self, obj):
        return not obj.is_anonymous


class TicketSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ticket
        exclude = ["status", "author", "date"]


class LabelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Label
        fields = "__all__"


class AvatarProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ["avatar"]

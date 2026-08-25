from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    is_authenticated = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["username", "is_authenticated", "is_staff", "is_active"]

    def get_is_authenticated(self, obj):
        return not obj.is_anonymous

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms


class InviteForm(UserCreationForm):
    tos = forms.BooleanField(
        required=True, error_messages={"required": "You must agree to the tos"}
    )

    class Meta:
        model = User
        fields = (
            "username",
            "tos",
        )

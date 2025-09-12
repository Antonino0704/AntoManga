from django_registration.forms import UserCreationForm
from django.contrib.auth.models import User


class InviteForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username",)

from django.db import models
from django.contrib.auth.models import User


class InviteToken(models.Model):
    token = models.CharField(max_length=25, unique=True)
    expire = models.BooleanField(default=False)
    date_of_use = models.DateTimeField(null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="invites")
    new_user = models.OneToOneField(
        User, on_delete=models.PROTECT, related_name="invite_join", null=True
    )

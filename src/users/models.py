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

    def __str__(self):
        return self.token


class Label(models.Model):
    label_choices = [
        ("red", "Red"),
        ("green", "Green"),
        ("blue", "Blue"),
        ("Yellow", "Yellow"),
    ]

    name = models.CharField(max_length=20, unique=True)
    color = models.CharField(max_length=20, choices=label_choices)

    def __str__(self):
        return self.name


class Ticket(models.Model):

    title = models.CharField(max_length=20)
    email = models.EmailField()
    description = models.TextField()
    label = models.ForeignKey(Label, on_delete=models.PROTECT, related_name="tickets")
    status = models.BooleanField(default=False)  # False = open while True + close
    author = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="tickets", null=True
    )
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

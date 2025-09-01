from django.db.models.signals import pre_save
from django.dispatch import receiver

import random
import string
from core.randomString import generate_random_string

from users.models import InviteToken


@receiver(pre_save, sender=InviteToken)
def generate_token(sender, instance, *args, **kwargs):
    if not instance.id:
        instance.token = "token" + generate_random_string(
            string.ascii_lowercase + string.digits, 25
        )

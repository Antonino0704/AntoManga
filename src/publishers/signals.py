from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.text import slugify

from publishers.models import Publisher


@receiver(pre_save, sender=Publisher)
def add_slug_to_question(sender, instance, *args, **kwargs):
    instance.slug = slugify(instance.name)
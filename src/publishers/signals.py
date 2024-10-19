from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.text import slugify

from publishers.models import Publisher

from core.randomString import generate_random_string


@receiver(pre_save, sender=Publisher)
def add_slug_to_question(sender, instance, *args, **kwargs):
    if not instance.id or Publisher.objects.get(pk=instance.id).name != instance.name:
        instance.slug = slugify(instance.name + generate_random_string())

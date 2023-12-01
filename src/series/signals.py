from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.text import slugify

from series.models import Serie

from core.randomString import generate_random_string


@receiver(pre_save, sender=Serie)
def add_slug_to_question(sender, instance, *args, **kwargs):
    if instance.n_volumes <= 0 or instance.volumes_bought < 0 or instance.volumes_read < 0:
        raise Exception("the volumes can't be negative")
    if instance.n_volumes < instance.volumes_bought:
        raise Exception("the volumes bought can't be more than total volumes")
    if instance.volumes_bought < instance.volumes_read:
        raise Exception("the volumes read can't be more than total bought")
    
    instance.missed_volumes = instance.n_volumes - instance.volumes_bought

    if not instance.id or Serie.objects.get(pk=instance.id).name != instance.name:
       instance.slug = slugify(instance.name + generate_random_string())
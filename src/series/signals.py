from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils.text import slugify
from datetime import date

from series.models import Series

from core.randomString import generate_random_string


@receiver(pre_save, sender=Series)
def add_slug_to_series(sender, instance, *args, **kwargs):
    if (
        instance.n_volumes <= 0
        or instance.volumes_bought < 0
        or instance.volumes_read < 0
    ):
        raise Exception("the volumes can't be negative")
    if instance.n_volumes < instance.volumes_bought:
        raise Exception("the volumes bought can't be more than total volumes")
    if instance.volumes_bought < instance.volumes_read:
        raise Exception("the volumes read can't be more than total bought")

    instance.missed_volumes = instance.n_volumes - instance.volumes_bought

    if instance.id:
        if instance.volumes_bought > Series.objects.get(pk=instance.id).volumes_bought:
            instance.purchased_at = date.today()
        elif (
            instance.volumes_bought < Series.objects.get(pk=instance.id).volumes_bought
        ):
            instance.purchased_at = None

    elif not instance.id and instance.volumes_bought > 0:
        instance.purchased_at = date.today()

    if not instance.id or Series.objects.get(pk=instance.id).name != instance.name:
        instance.slug = slugify(instance.name + generate_random_string())

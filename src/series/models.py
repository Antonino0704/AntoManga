from django.db import models
from publishers.models import Publisher
from django.contrib.auth.models import User


class Typology(models.Model):
    name = models.CharField(max_length=20)

    class Meta:
        verbose_name_plural = "Typologies"

    def __str__(self):
        return self.name


class Series(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    image = models.ImageField()
    n_volumes = models.IntegerField()
    volumes_bought = models.IntegerField()
    missed_volumes = models.IntegerField()
    volumes_read = models.IntegerField()
    publisher = models.ForeignKey(
        Publisher, on_delete=models.PROTECT, related_name="series"
    )
    typology = models.ForeignKey(
        Typology, on_delete=models.PROTECT, related_name="series_typology"
    )
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="series_list"
    )

    class Meta:
        verbose_name_plural = "Series"

    def __str__(self):
        return self.name

from django.db import models

class Publisher(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField()
from rest_framework import serializers
from publishers.models import Publisher


class PublisherSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = Publisher
        exclude = ["image"]


class ImagePublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = ["image"]

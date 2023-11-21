from rest_framework import serializers

from series.models import Typology, Serie

class TypologySerializer(serializers.ModelSerializer):

    class Meta:
        model = Typology
        fields = "__all__"

class SerieSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    missed_volumes = serializers.IntegerField(read_only=True)
    typology_name = serializers.CharField(source='typology.name', read_only=True)
    publisher_name = serializers.CharField(source='publisher.name', read_only=True)
    publisher_slug = serializers.CharField(source='publisher.slug', read_only=True)

    class Meta:
        model = Serie
        exclude = ["image"]


class ImageSerieSerializer(serializers.ModelSerializer):

    class Meta:
        model = Serie
        fields = ["image"]
from rest_framework import serializers

from series.models import Typology, Series


class TypologySerializer(serializers.ModelSerializer):

    class Meta:
        model = Typology
        fields = "__all__"


class SeriesSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)
    missed_volumes = serializers.IntegerField(read_only=True)
    typology_name = serializers.CharField(source="typology.name", read_only=True)
    publisher_name = serializers.CharField(source="publisher.name", read_only=True)
    publisher_slug = serializers.CharField(source="publisher.slug", read_only=True)
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Series
        exclude = ["image"]


class ImageSeriesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Series
        fields = ["image"]


class LegthSeriesSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Series
        fields = ["volumes_bought", "volumes_read", "owner"]

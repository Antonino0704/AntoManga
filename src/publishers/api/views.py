from rest_framework import viewsets
from rest_framework import generics

from publishers.api.serializers import PublisherSerializer, ImagePublisherSerializer
from publishers.models import Publisher

class PublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    lookup_field = "slug"
    serializer_class = PublisherSerializer

class ImagePublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    lookup_field = "slug"
    serializer_class = ImagePublisherSerializer

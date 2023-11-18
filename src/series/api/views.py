from rest_framework import viewsets
from rest_framework import generics

from series.models import Typology, Serie
from series.api.serializers import TypologySerializer, SerieSerializer, ImageSerieSerializer

class TypologyViewset(viewsets.ModelViewSet):
    queryset = Typology.objects.all()
    serializer_class = TypologySerializer

class SerieViewset(viewsets.ModelViewSet):
    queryset = Serie.objects.all()
    lookup_field = "slug"
    serializer_class = SerieSerializer

class SerieListView(generics.ListAPIView):
    serializer_class = SerieSerializer

    def get_queryset(self):
        publisher = self.kwargs.get("publisher")
        return Serie.objects.filter(publisher__slug=publisher)
    
class ImageSerieViewset(viewsets.ModelViewSet):
    queryset = Serie.objects.all()
    lookup_field = "slug"
    serializer_class = ImageSerieSerializer

class ImageSerieListView(generics.ListAPIView):
    serializer_class = ImageSerieSerializer

    def get_queryset(self):
        publisher = self.kwargs.get("publisher")
        return Serie.objects.filter(publisher__slug=publisher)
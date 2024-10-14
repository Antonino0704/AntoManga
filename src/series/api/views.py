from rest_framework import viewsets
from rest_framework import generics

from series.models import Typology, Series
from series.api.serializers import TypologySerializer, SeriesSerializer, ImageSeriesSerializer

class TypologyViewset(viewsets.ModelViewSet):
    queryset = Typology.objects.all()
    serializer_class = TypologySerializer

class SeriesViewset(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    lookup_field = "slug"
    serializer_class = SeriesSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Series.objects.all()
        return Series.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class SeriesListView(generics.ListAPIView):
    serializer_class = SeriesSerializer

    def get_queryset(self):
        publisher = self.kwargs.get("publisher")
        return Series.objects.filter(publisher__slug=publisher)
    
class ImageSeriesViewset(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    lookup_field = "slug"
    serializer_class = ImageSeriesSerializer

    def get_queryset(self):
        if self.request.user.is_anonymous:
            return Series.objects.all()
        return Series.objects.filter(owner=self.request.user)

class ImageSeriesListView(generics.ListAPIView):
    serializer_class = ImageSeriesSerializer

    def get_queryset(self):
        publisher = self.kwargs.get("publisher")
        return Series.objects.filter(publisher__slug=publisher)
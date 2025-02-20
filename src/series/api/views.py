from rest_framework import viewsets
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import F

from series.models import Typology, Series
from series.api.serializers import (
    TypologySerializer,
    SeriesSerializer,
    ImageSeriesSerializer,
    LegthSeriesSerializer,
)


class TypologyViewset(viewsets.ModelViewSet):
    queryset = Typology.objects.all()
    serializer_class = TypologySerializer
    pagination_class = None


class SeriesViewset(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    lookup_field = "slug"
    serializer_class = SeriesSerializer

    def get_queryset(self):
        seriesObjects = Series.objects.all()
        if "type" in self.request.query_params:
            seriesObjects = (
                seriesObjects.filter(typology=int(self.request.query_params["type"]))
                if int(self.request.query_params["type"]) > 0
                else seriesObjects.exclude(n_volumes=F("volumes_bought"))
            )
        if "filterbyname" in self.request.query_params:
            seriesObjects = seriesObjects.filter(
                name__contains=self.request.query_params["filterbyname"]
            )
        if self.request.user.is_anonymous:
            return seriesObjects
        return seriesObjects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class SeriesListView(generics.ListAPIView):
    serializer_class = SeriesSerializer

    def get_queryset(self):
        publisher = self.kwargs.get("publisher")
        if self.request.user.is_anonymous:
            return Series.objects.filter(publisher__slug=publisher)
        return Series.objects.filter(publisher__slug=publisher, owner=self.request.user)


class ImageSeriesViewset(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    lookup_field = "slug"
    serializer_class = ImageSeriesSerializer

    def get_queryset(self):
        seriesObjects = Series.objects.all()
        if "type" in self.request.query_params:
            seriesObjects = (
                seriesObjects.filter(typology=int(self.request.query_params["type"]))
                if int(self.request.query_params["type"]) > 0
                else seriesObjects.exclude(n_volumes=F("volumes_bought"))
            )
        if "filterbyname" in self.request.query_params:
            seriesObjects = seriesObjects.filter(
                name__contains=self.request.query_params["filterbyname"]
            )
        if self.request.user.is_anonymous:
            return seriesObjects
        return seriesObjects.filter(owner=self.request.user)


class ImageSeriesListView(generics.ListAPIView):
    serializer_class = ImageSeriesSerializer

    def get_queryset(self):
        publisher = self.kwargs.get("publisher")
        if self.request.user.is_anonymous:
            return Series.objects.filter(publisher__slug=publisher)
        return Series.objects.filter(publisher__slug=publisher, owner=self.request.user)


class LengthView(APIView):
    def get(self, request):
        volumes_read_tot = 0
        volumes_bought_tot = 0
        queryset = Series.objects.all()
        serializer = LegthSeriesSerializer(queryset, many=True)

        for series in serializer.data:
            if series["owner"] == request.user.username or request.user.is_anonymous:
                volumes_read_tot += series["volumes_read"]
                volumes_bought_tot += series["volumes_bought"]

        return Response(
            {
                "volumes_read_tot": volumes_read_tot,
                "volumes_bought_tot": volumes_bought_tot,
            }
        )

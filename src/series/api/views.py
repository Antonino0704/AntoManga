from rest_framework import viewsets
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from django.db.models.deletion import ProtectedError
from core.randomString import is_number

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

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
        except ProtectedError:
            return Response(
                {"protectedErrorDetail": "Cannot delete some instances of 'Type'"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class SeriesViewset(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    lookup_field = "slug"
    serializer_class = SeriesSerializer

    def get_queryset(self):
        seriesObjects = Series.objects.all()
        if "type" in self.request.query_params:
            filters = self.request.query_params["type"].split(",")
            filters = list(filter(lambda filter: filter.strip(), filters))

            if "-3" in filters:
                if "-4" not in filters:
                    seriesObjects = Series.objects.filter(is_discontinued=False)
                filters = list(filter(lambda t: t != "-3", filters))

            if "-4" in filters:
                seriesObjects = Series.objects.filter(is_discontinued=True)
                filters = list(filter(lambda t: t != "-4", filters))

            if "-1" in filters:
                seriesObjects = seriesObjects.exclude(n_volumes=F("volumes_bought"))
                filters = list(filter(lambda t: t != "-1", filters))

            if "-2" in filters:
                seriesObjects = seriesObjects.exclude(volumes_read=F("volumes_bought"))
                filters = list(filter(lambda t: t != "-2", filters))

            if len(filters) > 0:
                seriesObjects = seriesObjects.filter(
                    typology__in=list(map(int, filter(is_number, filters)))
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
            filters = self.request.query_params["type"].split(",")
            filters = list(filter(lambda filter: filter.strip(), filters))

            if "-3" in filters:
                if "-4" not in filters:
                    seriesObjects = Series.objects.filter(is_discontinued=False)
                filters = list(filter(lambda t: t != "-3", filters))

            if "-4" in filters:
                seriesObjects = Series.objects.filter(is_discontinued=True)
                filters = list(filter(lambda t: t != "-4", filters))

            if "-1" in filters:
                seriesObjects = seriesObjects.exclude(n_volumes=F("volumes_bought"))
                filters = list(filter(lambda t: t != "-1", filters))

            if "-2" in filters:
                seriesObjects = seriesObjects.exclude(volumes_read=F("volumes_bought"))
                filters = list(filter(lambda t: t != "-2", filters))

            if len(filters) > 0:
                seriesObjects = seriesObjects.filter(
                    typology__in=list(map(int, filter(is_number, filters)))
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
        queryset = (
            Series.objects.all()
            if not "type" in self.request.query_params
            else (
                Series.objects.filter(typology=int(self.request.query_params["type"]))
                if int(self.request.query_params["type"]) != -1
                else Series.objects.exclude(
                    n_volumes=F("volumes_bought")
                )  # it should be removed
            )
        )
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

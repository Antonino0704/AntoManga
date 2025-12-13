from rest_framework import viewsets
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models.deletion import ProtectedError

from publishers.api.serializers import PublisherSerializer, ImagePublisherSerializer
from publishers.models import Publisher

from series.models import Typology, Series


class PublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    lookup_field = "slug"
    serializer_class = PublisherSerializer
    pagination_class = None

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
        except ProtectedError:
            return Response(
                {
                    "protectedErrorDetail": "Cannot delete this Publisher because other users are using it"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)


class ImagePublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    lookup_field = "slug"
    serializer_class = ImagePublisherSerializer
    pagination_class = None


class PublisherStatsView(APIView):
    def get(self, request, *args, **kwargs):
        publisher = self.kwargs.get("publisher")
        type = self.kwargs.get("type")
        seriesObjects = (
            Series.objects.filter(publisher__slug=publisher, typology=int(type))
            if self.request.user.is_anonymous
            else Series.objects.filter(
                publisher__slug=publisher, typology=int(type), owner=self.request.user
            )
        )
        return Response({"count": seriesObjects.count()})

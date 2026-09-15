from django.urls import path, include
from rest_framework.routers import DefaultRouter

from series.api.views import (
    TypologyViewset,
    SeriesViewset,
    SeriesListView,
    ImageSeriesViewset,
    ImageSeriesListView,
    LengthView,
)

router = DefaultRouter()
router.register("types", TypologyViewset)
router.register("series", SeriesViewset, basename="series")
router.register("image/series", ImageSeriesViewset, basename="image-series")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "series-list/<slug:publisher>/",
        SeriesListView.as_view(),
        name="publisher-series-list",
    ),
    path(
        "image/series-list/<slug:publisher>/",
        ImageSeriesListView.as_view(),
        name="publisher-image-series-list",
    ),
    path("series-length/", LengthView.as_view(), name="length-view"),
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from series.api.views import (TypologyViewset, SerieViewset, 
                             SerieListView , ImageSerieViewset, ImageSerieListView)

router = DefaultRouter()
router.register("types", TypologyViewset)
router.register("series", SerieViewset)
router.register("image/series", ImageSerieViewset)

urlpatterns = [
    path("", include(router.urls)),

    path("series-list/<slug:publisher>/",
         SerieListView.as_view(),
         name="series-list"),

    path("image/series-list/<slug:publisher>/",
         ImageSerieListView.as_view(),
         name="image-series-list")
]
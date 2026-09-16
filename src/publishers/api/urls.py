from django.urls import path, include
from rest_framework.routers import DefaultRouter

from publishers.api.views import (
    PublisherViewSet,
    ImagePublisherViewSet,
    PublisherStatsView,
    PublisherViewShortVersion,
)

router = DefaultRouter()
router.register(r"publishers", PublisherViewSet, basename="publisher")
router.register(r"image/publishers", ImagePublisherViewSet, basename="image-publisher")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "publisher-stats/<slug:publisher>/<str:type>/",
        PublisherStatsView.as_view(),
        name="publisherStats-view",
    ),
    path(
        "short-version/publishers/",
        PublisherViewShortVersion.as_view(),
        name="publisherShortVersions-view",
    ),
]

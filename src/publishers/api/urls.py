from django.urls import path, include
from rest_framework.routers import DefaultRouter

from publishers.api.views import PublisherViewSet, ImagePublisherViewSet

router = DefaultRouter()
router.register(r"publishers", PublisherViewSet)
router.register(r"publishers-image", ImagePublisherViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
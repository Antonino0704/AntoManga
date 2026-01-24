from django.urls import path

from core.api.views import (
    ReadVersionAPIView,
    getLicenseView,
    validateImage,
)

urlpatterns = [
    path("version/", ReadVersionAPIView.as_view(), name="version"),
    path("license/", getLicenseView.as_view(), name="getLicense"),
    path("image/validate/", validateImage.as_view(), name="validate-image"),
]

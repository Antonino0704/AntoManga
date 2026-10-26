from django.urls import path

from core.api.views import ReadVersionAPIView, GetLicenseView, ValidateImage, LogoutView

urlpatterns = [
    path("version/", ReadVersionAPIView.as_view(), name="version"),
    path("license/", GetLicenseView.as_view(), name="getLicense"),
    path("image/validate/", ValidateImage.as_view(), name="validate-image"),
    path("logout/", LogoutView.as_view(), name="logout-view"),
]

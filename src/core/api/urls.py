from django.urls import path

from core.api.views import IsAuthenticatedView, ReadVersionAPIView, getLicenseView, validateImage

urlpatterns = [
    path("isAuthenticated/", IsAuthenticatedView.as_view(), name="isAuthenticated"),
    path("version/", ReadVersionAPIView.as_view(), name="version"),
    path("license/", getLicenseView.as_view(), name="getLicense"),
    path("image/validate/", validateImage.as_view(), name="validate-image"),
]

from django.urls import path

from core.api.views import IsAuthenticatedView, ReadVersionAPIView

urlpatterns = [
    path("isAuthenticated/", IsAuthenticatedView.as_view(), name="isAuthenticated"),
    path("version/", ReadVersionAPIView.as_view(), name="version"),
]

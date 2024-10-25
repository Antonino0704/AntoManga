from django.urls import path

from core.api.views import IsAuthenticatedView, ReadVersinAPIView

urlpatterns = [
    path("isAuthenticated/", IsAuthenticatedView.as_view(), name="isAuthenticated"),
    path("version/", ReadVersinAPIView.as_view(), name="version"),
]

from django.urls import path

from core.api.views import IsAuthenticatedView

urlpatterns = [
    path("isAuthenticated/",
         IsAuthenticatedView.as_view(),
         name="isAuthenticated"),
]

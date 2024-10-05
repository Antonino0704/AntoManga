from django.urls import path

from core.api.views import IsAuthenticateView

urlpatterns = [
    path("isAuthenticated/",
         IsAuthenticateView.as_view(),
         name="isAuthenticated"),
]
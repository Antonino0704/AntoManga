from django.urls import path
from users.api.views import UserView

urlpatterns = [
    path("user-me/", UserView.as_view(), name="user-view"),
]

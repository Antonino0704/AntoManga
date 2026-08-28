from django.urls import path
from users.api.views import UserView, TicketView

urlpatterns = [
    path("user-me/", UserView.as_view(), name="user-view"),
    path("ticket/create/", TicketView.as_view(), name="ticket-view"),
]

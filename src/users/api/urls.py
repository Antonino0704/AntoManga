from django.urls import path
from users.api.views import UserView, TicketView, LabelView

urlpatterns = [
    path("user-me/", UserView.as_view(), name="user-view"),
    path("ticket/create/", TicketView.as_view(), name="ticket-view"),
    path("ticket/labels/", LabelView.as_view(), name="label-view"),
]

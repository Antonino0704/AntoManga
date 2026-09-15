import json

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from django.contrib.auth.models import User

from users.models import Label, Ticket, Profile

from users.api.serializers import UserSerializer, AvatarProfileSerializer

from core.methodsForTests import get_test_image


class UserViewTestCase(APITestCase):
    url = reverse("user-view")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.client.login(username="Test", password="test_password_123")

    def test_user_retrive_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "")
        self.assertEqual(response.data["is_authenticated"], False)

    def test_user_retrive_authenticated(self):
        serializer_data = UserSerializer(self.user).data
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, serializer_data)

    def test_user_update_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {"username": "test_username"}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_update_authenticated(self):
        data = {"username": "test_username"}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["updated"], True)

    def test_user_delete_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_delete_authenticated(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_delete_staff(self):
        super_user = User.objects.create_superuser(
            username="super_user_test", password="test_password_123"
        )
        self.client.force_authenticate(user=super_user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(User.objects.get(pk=2), super_user)


class TicketViewTestCase(APITestCase):
    url = reverse("ticket-view")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.label = Label.objects.create(name="init_test", color="red")
        self.client.login(username="Test", password="test_password_123")

    def test_ticket_create_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {
            "title": "test_title",
            "email": "fakemail@fakedomain.com",
            "description": "it's a test!",
            "label": self.label.pk,
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "test_title")
        self.assertIsNone(Ticket.objects.get(pk=1).author)

    def test_ticket_create_authenticated(self):
        data = {
            "title": "test_title",
            "email": "fakemail@fakedomain.com",
            "description": "it's a test!",
            "label": self.label.pk,
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "test_title")
        self.assertEqual(Ticket.objects.get(pk=1).author, self.user)


class LabelViewTestCase(APITestCase):
    url = reverse("label-view")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.label = Label.objects.create(name="init_test", color="red")
        self.client.login(username="Test", password="test_password_123")

    def test_label_retrive_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_label_retrive_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AvatarProfilViewTestCase(APITestCase):
    url = reverse("avatar-view")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.profile = Profile.objects.create(user=self.user, avatar=get_test_image())
        self.client.login(username="Test", password="test_password_123")

    def test_user_retrive_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_retrive_authenticated(self):
        serializer_data = AvatarProfileSerializer(self.profile).data
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, serializer_data)

    def test_user_update_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {"avatar": get_test_image()}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_update_authenticated(self):
        data = {"avatar": get_test_image()}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

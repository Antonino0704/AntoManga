import json

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from django.contrib.auth.models import User
from publishers.models import Publisher

from publishers.api.serializers import PublisherSerializer
from series.models import Typology, Series

from core.testImage import get_test_image


class PublisherViewsetTestCase(APITestCase):
    url = reverse("publisher-list")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.publisher = Publisher.objects.create(
            name="publisher_test", description="description test"
        )
        self.api_authentication()

    def api_authentication(self):
        self.client.login(username="Test", password="test_password_123")

    def test_publisher_list_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_publisher_list_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_publisher_create_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {"name": "test", "description": "test"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_publisher_create_authenticated(self):
        data = {"name": "test", "description": "test"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "test")

    def test_single_publisher_retrive_un_authenticated(self):
        self.client.force_authenticate(user=None)
        serializer_data = PublisherSerializer(self.publisher).data
        response = self.client.get(
            reverse("publisher-detail", kwargs={"slug": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, serializer_data)

    def test_single_publisher_retrive_authenticated(self):
        serializer_data = PublisherSerializer(self.publisher).data
        response = self.client.get(
            reverse("publisher-detail", kwargs={"slug": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, serializer_data)

    def test_publisher_update_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {"description": "description test updated"}
        response = self.client.put(
            reverse("publisher-detail", kwargs={"slug": self.publisher.slug}), data
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_publisher_update_authenticated(self):
        data = {"name": "title updated", "description": "description test updated"}
        response = self.client.put(
            reverse("publisher-detail", kwargs={"slug": self.publisher.slug}), data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["description"], "description test updated")

    def test_publisher_delete_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(
            reverse("publisher-detail", kwargs={"slug": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_publisher_delete_authenticated(self):
        response = self.client.delete(
            reverse("publisher-detail", kwargs={"slug": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_publisher_delete_protectedError(self):
        type = Typology.objects.create(name="test")
        Series.objects.create(
            name="series_test",
            n_volumes=1,
            volumes_bought=1,
            volumes_read=1,
            publisher=self.publisher,
            typology=type,
            owner=self.user,
        )
        response = self.client.delete(
            reverse("publisher-detail", kwargs={"slug": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["protectedErrorDetail"],
            "Cannot delete this Publisher because other users are using it",
        )


class ImagePublisherViewsetTestCase(APITestCase):
    url = reverse("image-publisher-list")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.publisher = Publisher.objects.create(
            name="publisher_test", description="description test"
        )
        self.api_authentication()

    def api_authentication(self):
        self.client.login(username="Test", password="test_password_123")

    def test_image_add_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {"image": get_test_image()}
        response = self.client.put(
            reverse("image-publisher-detail", kwargs={"slug": self.publisher.slug}),
            data,
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_image_add_authenticated(self):
        data = {"image": get_test_image()}
        response = self.client.put(
            reverse("image-publisher-detail", kwargs={"slug": self.publisher.slug}),
            data,
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("image", response.data)

    def test_image_delete_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(
            reverse("image-publisher-detail", kwargs={"slug": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_image_delete_authenticated(self):
        response = self.client.delete(
            reverse("image-publisher-detail", kwargs={"slug": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

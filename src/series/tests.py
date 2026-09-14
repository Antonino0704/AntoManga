from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
import json
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date


from django.contrib.auth.models import User
from series.models import Typology, Series
from publishers.models import Publisher

from series.api.serializers import TypologySerializer


class TypologyViewsetTestCase(APITestCase):
    url = reverse("typology-list")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.type = Typology.objects.create(name="init_test")
        self.api_authentication()

    def api_authentication(self):
        self.client.login(username="Test", password="test_password_123")

    def test_typology_list_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_typology_list_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_typology_create_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {"name": "test typology"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_typology_create_authenticated(self):
        data = {"name": "test typology"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "test typology")

    def test_single_typology_retrive(self):
        serializer_data = TypologySerializer(self.type).data
        response = self.client.get(reverse("typology-detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(serializer_data, response_data)

    def test_typology_update_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {"name": "hack!"}
        response = self.client.put(reverse("typology-detail", kwargs={"pk": 1}), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_typology_update_authenticated(self):
        data = {"name": "name changed"}
        response = self.client.put(reverse("typology-detail", kwargs={"pk": 1}), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "name changed")

    def test_typology_delete_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(reverse("typology-detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_typology_delete_authenticated(self):
        response = self.client.delete(reverse("typology-detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_typology_delete_protectedError(self):
        publisher = Publisher.objects.create(name="publisher_test")
        Series.objects.create(
            name="series_test",
            n_volumes=1,
            volumes_bought=1,
            volumes_read=1,
            publisher=publisher,
            typology=self.type,
            owner=self.user,
        )
        response = self.client.delete(reverse("typology-detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["protectedErrorDetail"],
            "Cannot delete this Type because other users are using it",
        )


class SeriesViewsetTestCase(APITestCase):
    url = reverse("series-list")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.type = Typology.objects.create(name="type_test")
        self.publisher = Publisher.objects.create(name="publisher_test")
        self.series = Series.objects.create(
            name="init_series_test",
            n_volumes=1,
            volumes_bought=1,
            volumes_read=1,
            publisher=self.publisher,
            typology=self.type,
            owner=self.user,
        )
        self.api_authentication()

    def api_authentication(self):
        self.client.login(username="Test", password="test_password_123")

    def test_series_list_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_series_list_authenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_series_create_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {
            "name": "series_test",
            "n_volumes": 1,
            "volumes_bought": 1,
            "volumes_read": 1,
            "publisher": self.publisher.pk,
            "typology": self.type.pk,
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_series_create_authenticated(self):
        data = {
            "name": "series_test",
            "n_volumes": 1,
            "volumes_bought": 1,
            "volumes_read": 1,
            "publisher": self.publisher.pk,
            "typology": self.type.pk,
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(response.data["name"], "series_test")

        self.assertEqual(response.data["n_volumes"], 1)
        self.assertEqual(response.data["volumes_bought"], 1)
        self.assertEqual(response.data["volumes_read"], 1)
        self.assertEqual(response.data["missed_volumes"], 0)

        self.assertEqual(response.data["publisher"], 1)
        self.assertEqual(response.data["typology"], 1)
        self.assertEqual(response.data["is_discontinued"], False)
        self.assertEqual(
            response.data["purchased_at"], date.today().strftime("%Y-%m-%d")
        )
        self.assertRegex(response.data["slug"], "series_test-[a-z0-9]+")

    def test_series_create_authenticated_with_volumes_bought_more_than_volumes(self):
        data = {
            "name": "series_test",
            "n_volumes": 1,
            "volumes_bought": 2,  # here
            "volumes_read": 1,
            "publisher": self.publisher.pk,
            "typology": self.type.pk,
        }
        with self.assertRaisesMessage(
            Exception, "the volumes bought can't be more than total volumes"
        ):
            self.client.post(self.url, data)

    def test_series_create_authenticated_with_volumes_read_more_than_volumes_bought(
        self,
    ):
        data = {
            "name": "series_test",
            "n_volumes": 1,
            "volumes_bought": 1,
            "volumes_read": 2,  # here
            "publisher": self.publisher.pk,
            "typology": self.type.pk,
        }
        with self.assertRaisesMessage(
            Exception, "the volumes read can't be more than total bought"
        ):
            self.client.post(self.url, data)


# TO DO
# Not Authenticated, Authenticated, and Different User, single retrive, put and delete


class ImageSeriesViewsetTestCase(APITestCase):
    url = reverse("image-series-list")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.type = Typology.objects.create(name="type_test")
        self.publisher = Publisher.objects.create(name="publisher_test")
        self.series = Series.objects.create(
            name="init_series_test",
            n_volumes=1,
            volumes_bought=1,
            volumes_read=1,
            publisher=self.publisher,
            typology=self.type,
            owner=self.user,
        )
        self.api_authentication()

    def api_authentication(self):
        self.client.login(username="Test", password="test_password_123")

    def get_test_image(self):
        buffer = BytesIO()
        img = Image.new("RGB", (100, 100), color="red")
        img.save(buffer, format="JPEG")
        buffer.seek(0)
        return SimpleUploadedFile(
            name="test_image.jpg",
            content=buffer.read(),
            content_type="image/jpeg",
        )

    def test_image_add(self):
        data = {"image": self.get_test_image()}
        response = self.client.put(
            reverse("image-series-detail", kwargs={"slug": self.series.slug}), data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("image", response.data)

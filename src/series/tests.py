import json

from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from datetime import date

from django.contrib.auth.models import User
from series.models import Typology, Series
from publishers.models import Publisher

from series.api.serializers import TypologySerializer, SeriesSerializer

from core.methodsForTests import get_test_image, other_user


class TypologyViewsetTestCase(APITestCase):
    url = reverse("typology-list")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.type = Typology.objects.create(name="init_test")
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
        response = self.client.get(
            reverse("typology-detail", kwargs={"pk": self.type.pk})
        )
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
        response = self.client.put(
            reverse("typology-detail", kwargs={"pk": self.type.pk}), data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "name changed")

    def test_typology_delete_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(reverse("typology-detail", kwargs={"pk": 1}))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_typology_delete_authenticated(self):
        response = self.client.delete(
            reverse("typology-detail", kwargs={"pk": self.type.pk})
        )
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
        response = self.client.delete(
            reverse("typology-detail", kwargs={"pk": self.type.pk})
        )
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

        self.assertEqual(response.data["publisher"], self.publisher.pk)
        self.assertEqual(
            response.data["typology"],
            self.type.pk,
        )
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

    def test_single_series_retrive_un_authenticated(self):
        self.client.force_authenticate(user=None)
        serializer_data = SeriesSerializer(self.series).data
        response = self.client.get(
            reverse("series-detail", kwargs={"slug": self.series.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, serializer_data)

    def test_single_series_retrive_owner(self):
        serializer_data = SeriesSerializer(self.series).data
        response = self.client.get(
            reverse("series-detail", kwargs={"slug": self.series.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = json.loads(response.content)
        self.assertEqual(response_data, serializer_data)

    def test_single_series_retrive_not_owner(self):
        other_user(self.client)
        response = self.client.get(
            reverse("series-detail", kwargs={"slug": self.series.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_single_series_update_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {
            "name": "series_test_updated",
            "n_volumes": 2,
            "volumes_bought": 1,
            "volumes_read": 1,
            "publisher": self.publisher.pk,
            "typology": self.type.pk,
        }
        response = self.client.put(
            reverse("series-detail", kwargs={"slug": self.series.slug}), data
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_single_series_update_owner(self):
        data = {
            "name": "series_test_updated",
            "n_volumes": 2,
            "volumes_bought": 1,
            "volumes_read": 1,
            "publisher": self.publisher.pk,
            "typology": self.type.pk,
        }
        response = self.client.put(
            reverse("series-detail", kwargs={"slug": self.series.slug}), data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "series_test_updated")
        self.assertEqual(response.data["n_volumes"], 2)

    def test_single_series_update_not_owner(self):
        other_user(self.client)
        data = {
            "name": "series_test_updated",
            "n_volumes": 2,
            "volumes_bought": 1,
            "volumes_read": 1,
            "publisher": self.publisher.pk,
            "typology": self.type.pk,
        }
        response = self.client.put(
            reverse("series-detail", kwargs={"slug": self.series.slug}), data
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_single_series_delete_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.delete(
            reverse("series-detail", kwargs={"slug": self.series.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_single_series_delete_owner(self):
        response = self.client.delete(
            reverse("series-detail", kwargs={"slug": self.series.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_single_series_delete_not_owner(self):
        other_user(self.client)
        response = self.client.delete(
            reverse("series-detail", kwargs={"slug": self.series.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_series_list_filterbyname(self):
        # create 2 series
        series2 = Series.objects.get(pk=self.series.pk)
        series2.pk = None
        series2.name = "test 2"
        series2.save()

        response = self.client.get(f"{self.url}?filterbyname=init")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], self.series.pk)

    def test_series_list_filterby_type(self):
        # create 2 type
        type2 = Typology.objects.create(name="type 2")
        # create 2 series
        series2 = Series.objects.get(pk=self.series.pk)
        series2.pk = None
        series2.typology = type2
        series2.save()

        response = self.client.get(f"{self.url}?type={self.type.pk}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], self.series.pk)

    def test_series_list_filterby_publisher(self):
        # create 2 publisher
        publisher2 = Publisher.objects.create(name="publisher 2")
        # create 2 series
        series2 = Series.objects.get(pk=self.series.pk)
        series2.pk = None
        series2.publisher = publisher2
        series2.save()

        response = self.client.get(f"{self.url}?publisher={self.publisher.pk}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], self.series.pk)

    def test_series_list_filterby_special_type_incomplete(self):
        # create 2 series
        series2 = Series.objects.get(pk=self.series.pk)
        series2.pk = None
        series2.n_volumes = 2
        series2.save()

        response = self.client.get(f"{self.url}?type=-1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], series2.pk)

    def test_series_list_filterby_special_type_readyToRead(self):
        # create 2 series
        series2 = Series.objects.get(pk=self.series.pk)
        series2.pk = None
        series2.n_volumes = 2
        series2.volumes_bought = 2
        series2.save()

        response = self.client.get(f"{self.url}?type=-2")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], series2.pk)

    def test_series_list_filterby_special_type_excludeDiscontinuedSeries(self):
        # create 2 series
        series2 = Series.objects.get(pk=self.series.pk)
        series2.pk = None
        series2.is_discontinued = True
        series2.save()

        response = self.client.get(f"{self.url}?type=-3")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], self.series.pk)

    def test_series_list_filterby_special_type_discontinuedSeriesOnly(self):
        # create 2 series
        series2 = Series.objects.get(pk=self.series.pk)
        series2.pk = None
        series2.is_discontinued = True
        series2.save()

        response = self.client.get(f"{self.url}?type=-4")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], series2.pk)

    def test_series_list_sort_mostRecent(self):
        # create series
        series2 = Series.objects.get(pk=self.series.pk)
        series2.pk = None
        series2.save()

        series3 = Series.objects.get(pk=self.series.pk)
        series3.pk = None
        series3.save()

        # update date
        Series.objects.filter(pk=series2.pk).update(
            purchased_at=date(2002, 1, 1).strftime("%Y-%m-%d")
        )
        Series.objects.filter(pk=series3.pk).update(
            purchased_at=date(2002, 1, 2).strftime("%Y-%m-%d")
        )
        series2.refresh_from_db()
        series3.refresh_from_db()

        response = self.client.get(f"{self.url}?purchased_at=desc")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 3)
        self.assertEqual(response.data["results"][0]["id"], self.series.pk)
        self.assertEqual(response.data["results"][1]["id"], series3.pk)
        self.assertEqual(response.data["results"][2]["id"], series2.pk)

    def test_series_list_sort_leastRecent(self):
        # create series
        series2 = Series.objects.get(pk=self.series.pk)
        series2.pk = None
        series2.save()

        series3 = Series.objects.get(pk=self.series.pk)
        series3.pk = None
        series3.save()

        # update date
        Series.objects.filter(pk=series2.pk).update(
            purchased_at=date(2002, 1, 1).strftime("%Y-%m-%d")
        )
        Series.objects.filter(pk=series3.pk).update(
            purchased_at=date(2002, 1, 2).strftime("%Y-%m-%d")
        )
        series2.refresh_from_db()
        series3.refresh_from_db()

        response = self.client.get(f"{self.url}?purchased_at=asc")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 3)
        self.assertEqual(response.data["results"][2]["id"], self.series.pk)
        self.assertEqual(response.data["results"][1]["id"], series3.pk)
        self.assertEqual(response.data["results"][0]["id"], series2.pk)


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
        self.client.login(username="Test", password="test_password_123")

    def test_image_add_owner(self):
        data = {"image": get_test_image()}
        response = self.client.put(
            reverse("image-series-detail", kwargs={"slug": self.series.slug}), data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("image", response.data)

    def test_image_add_not_owner(self):
        other_user(self.client)
        data = {"image": get_test_image()}
        response = self.client.put(
            reverse("image-series-detail", kwargs={"slug": self.series.slug}), data
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertNotIn("image", response.data)

    def test_image_add_un_authenticated(self):
        self.client.force_authenticate(user=None)
        data = {"image": get_test_image()}
        response = self.client.put(
            reverse("image-series-detail", kwargs={"slug": self.series.slug}), data
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotIn("image", response.data)

    def test_image_delete_owner(self):
        response = self.client.delete(
            reverse("image-series-detail", kwargs={"slug": self.series.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_image_delete_not_owner(self):
        other_user(self.client)
        response = self.client.delete(
            reverse("image-series-detail", kwargs={"slug": self.series.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_image_delete_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.put(
            reverse("image-series-detail", kwargs={"slug": self.series.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class SeriesListViewTestCase(APITestCase):

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
        self.client.login(username="Test", password="test_password_123")

    def test_seriesList_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(
            reverse("publisher-series-list", kwargs={"publisher": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_seriesList_owner(self):
        response = self.client.get(
            reverse("publisher-series-list", kwargs={"publisher": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_seriesList_not_owner(self):
        other_user(self.client)
        response = self.client.get(
            reverse("publisher-series-list", kwargs={"publisher": self.publisher.slug})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)


class ImageSeriesListViewTestCase(APITestCase):

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
            image=get_test_image(),
        )
        self.client.login(username="Test", password="test_password_123")

    def test_imageSeriesList_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(
            reverse(
                "publisher-image-series-list", kwargs={"publisher": self.publisher.slug}
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertIsNotNone(response.data["results"][0]["image"])

    def test_imageSeriesList_owner(self):
        response = self.client.get(
            reverse(
                "publisher-image-series-list", kwargs={"publisher": self.publisher.slug}
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertIsNotNone(response.data["results"][0]["image"])

    def test_imageSeriesList_not_owner(self):
        other_user(self.client)
        response = self.client.get(
            reverse(
                "publisher-image-series-list", kwargs={"publisher": self.publisher.slug}
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)


class LengthViewTestCase(APITestCase):
    url = reverse("length-view")

    def setUp(self):
        self.user = User.objects.create_user(
            username="Test", password="test_password_123"
        )
        self.type = Typology.objects.create(name="type_test")
        self.publisher = Publisher.objects.create(name="publisher_test")
        self.series = Series.objects.create(
            name="init_series_test",
            n_volumes=5,
            volumes_bought=5,
            volumes_read=2,
            publisher=self.publisher,
            typology=self.type,
            owner=self.user,
        )
        self.client.login(username="Test", password="test_password_123")

    def test_lengthView_un_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["volumes_read_tot"], 2)
        self.assertEqual(response.data["volumes_bought_tot"], 5)

    def test_lengthView_owner(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["volumes_read_tot"], 2)
        self.assertEqual(response.data["volumes_bought_tot"], 5)

    def test_lengthView_not_owner(self):
        other_user(self.client)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["volumes_read_tot"], 0)
        self.assertEqual(response.data["volumes_bought_tot"], 0)

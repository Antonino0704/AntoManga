from io import BytesIO
from PIL import Image

from django.core.files.uploadedfile import SimpleUploadedFile

from django.contrib.auth.models import User


def get_test_image():
    buffer = BytesIO()
    img = Image.new("RGB", (100, 100), color="red")
    img.save(buffer, format="JPEG")
    buffer.seek(0)
    return SimpleUploadedFile(
        name="test_image.jpg",
        content=buffer.read(),
        content_type="image/jpeg",
    )


def other_user(client):
    user = User.objects.create_user(username="Test2", password="test_password_123")
    client.force_authenticate(user=user)

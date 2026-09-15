from io import BytesIO
from PIL import Image

from django.core.files.uploadedfile import SimpleUploadedFile


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

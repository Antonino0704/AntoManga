from django.core.management.utils import get_random_secret_key

with open(".env", "w") as f:
    f.write(f"secret_key={get_random_secret_key()}")
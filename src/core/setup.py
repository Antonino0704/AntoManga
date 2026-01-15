from django.core.management.utils import get_random_secret_key
import os


def generate_env_file():
    keyWords = {
        "secret_key": get_random_secret_key(),
        "DEBUG": False,
        "ALLOWED_HOSTS": "*,",
        "VITE_LIVE_SERVER": False,
        "VITE_NETWORK": False,
        "BETA": False,
    }
    path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    with open(f"{path}/.env", "w") as f:
        for key in keyWords.keys():
            f.write(f"{key}={keyWords.get(key)}\n")


def get_bool(value):
    return True if value.lower() == "true" else False


if __name__ == "__main__":
    generate_env_file()

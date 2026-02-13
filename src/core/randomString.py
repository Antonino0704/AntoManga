import random
import string

ALPHANUMERIC_CHARS = string.ascii_lowercase + string.digits
STRING_LENGTH = 6


def generate_random_string(chars=ALPHANUMERIC_CHARS, length=STRING_LENGTH):
    return "-" + "".join(random.choice(chars) for _ in range(length))


def is_number(n):
    try:
        int(n)
        return True
    except:
        return False

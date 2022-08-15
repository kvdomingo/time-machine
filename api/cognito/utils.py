import base64
import hashlib
import hmac
import json
import string
from random import SystemRandom

from django.conf import settings
from django.contrib.auth.models import User
from django.core.cache import cache

from ..schemas import CognitoUser


def generate_random_string(length: int = 8, num_digits: int = 2, num_specials: int = 2) -> str:
    random = SystemRandom()
    digits = "".join([random.choice(string.digits) for _ in range(num_digits)])
    punctuation = "".join([random.choice(string.punctuation.replace("\\", "")) for _ in range(num_specials)])
    str_ = User.objects.make_random_password(
        length=length - num_digits - num_specials, allowed_chars=string.ascii_letters
    )
    str_ = list(str_ + digits + punctuation)
    random.shuffle(str_)
    return "".join(str_)


def generate_hash(username: str) -> str:
    signature = hmac.new(
        bytes(settings.COGNITO_CLIENT_SECRET, "utf-8"),
        bytes(username + settings.COGNITO_CLIENT_ID, "utf-8"),
        digestmod=hashlib.sha256,
    ).digest()
    return base64.b64encode(signature).decode()


def get_users_from_cache() -> list[CognitoUser] | None:
    cached = cache.get("cognito_users")
    if not cached:
        return None
    parsed = json.loads(cached)
    return [CognitoUser(**u) for u in parsed]


def set_users_cache(users: list[CognitoUser]) -> None:
    stringed = json.dumps([u.dict() for u in users])
    cache.set("cognito_users", stringed, timeout=60 * 5)

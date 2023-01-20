import json
import os

import requests


def load_env(name: str):
    env = os.environ.get(name)
    if env is None:
        raise EnvironmentError(f"Missing env {env}")
    return env


def get_jwks(cognito_pool: str):
    res = requests.get(f"{cognito_pool}/.well-known/jwks.json")
    if not res.ok:
        raise ConnectionError(f"Unable to retrieve JWKS from {cognito_pool}")
    keys = res.json()
    return {key["kid"]: json.dumps(key) for key in keys["keys"]}

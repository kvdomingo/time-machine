import json
import os
import urllib

import requests


def load_env(name: str):
    env = os.environ.get(name)
    if env is None:
        raise EnvironmentError(f"Missing env {env}")
    return env


def get_database_connection():
    DATABASE_URL = os.environ.get("DATABASE_URL", "")
    if not DATABASE_URL:
        DB_NAME = os.environ.get("POSTGRESQL_DATABASE")
        DB_HOST = os.environ.get("POSTGRESQL_HOST")
        DB_PORT = int(os.environ.get("POSTGRESQL_PORT"))
        DB_USER = os.environ.get("POSTGRESQL_USERNAME")
        DB_PASSWORD = os.environ.get("POSTGRESQL_PASSWORD")
        DATABASE_URL = f"{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    DATABASE_URL = urllib.parse.quote(DATABASE_URL, ":/@")
    return f"postgres://{DATABASE_URL}"


def get_jwks(cognito_pool: str):
    res = requests.get(f"{cognito_pool}/.well-known/jwks.json")
    if not res.ok:
        raise ConnectionError(f"Unable to retrieve JWKS from {cognito_pool}")
    keys = res.json()
    return {key["kid"]: json.dumps(key) for key in keys["keys"]}

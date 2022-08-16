"""
Django settings for time_machine project.

Generated by 'django-admin startproject' using Django 4.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

import os
import urllib
from datetime import timedelta
from pathlib import Path

import dj_database_url
from django.core.management.utils import get_random_secret_key
from dotenv import load_dotenv

from .utils import get_database_connection, get_jwks, load_env

load_dotenv()

PYTHON_ENV = os.environ.get("PYTHON_ENV", "production")

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", default=get_random_secret_key())

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = PYTHON_ENV != "production"

DEBUG_PROPAGATE_EXCEPTIONS = True

ALLOWED_HOSTS = ["*"]


# CORS

CORS_ALLOW_ALL_ORIGINS = PYTHON_ENV != "production"

CORS_ALLOWED_ORIGIN_REGEXES = [r"https:\/\/.*\.kvdstudio\.app"]


# CSRF

CSRF_TRUSTED_ORIGINS = ["https://*.kvdstudio.app"]


# Application definition

INSTALLED_APPS = [
    "api.apps.ApiConfig",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "django_filters",
    "rest_framework",
    "rest_framework_jwt",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "time_machine.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "web" / "app"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "time_machine.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

if PYTHON_ENV == "production":
    DATABASE_URL = os.environ.get("DATABASE_URL")
    DATABASE_CONFIG = dj_database_url.parse(DATABASE_URL)
    DATABASE_CONFIG["HOST"] = urllib.parse.unquote(DATABASE_CONFIG["HOST"])
    DATABASES = {"default": DATABASE_CONFIG}
else:
    DATABASES = {"default": dj_database_url.parse(get_database_connection())}


# AWS

AWS_ACCESS_KEY_ID = load_env("AWS_ACCESS_KEY_ID")

AWS_SECRET_ACCESS_KEY = load_env("AWS_SECRET_ACCESS_KEY")

AWS_REGION = load_env("AWS_REGION")


# Cognito

COGNITO_CLIENT_ID = load_env("COGNITO_CLIENT_ID")

COGNITO_CLIENT_SECRET = load_env("COGNITO_CLIENT_SECRET")

COGNITO_USER_POOL_ID = load_env("COGNITO_USER_POOL")

COGNITO_REGION = AWS_REGION

COGNITO_POOL_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{COGNITO_USER_POOL_ID}"


# REST API

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_jwt.authentication.JSONWebTokenAuthentication",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 10,
}

JWT_AUTH = {
    "JWT_PAYLOAD_GET_USERNAME_HANDLER": "api.auth.get_username_from_payload_handler",
    "JWT_DECODE_HANDLER": "api.auth.cognito_jwt_decode_handler",
    "JWT_PUBLIC_KEY": get_jwks(COGNITO_POOL_URL),
    "JWT_ALGORITHM": "RS256",
    "JWT_AUDIENCE": COGNITO_CLIENT_ID,
    "JWT_VERIFY": True,
    "JWT_VERIFY_EXPIRATION": True,
    "JWT_LEEWAY": 60,
    "JWT_ISSUER": COGNITO_POOL_URL,
    "JWT_AUTH_COOKIE": "jwt",
    "JWT_AUTH_COOKIE_PATH": "/",
    "JWT_AUTH_COOKIE_SAMESITE": "Strict",
    "JWT_ALLOW_REFRESH": True,
}

if PYTHON_ENV == "production":
    REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] = [
        "rest_framework.renderers.JSONRenderer",
    ]


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.RemoteUserBackend",
    "django.contrib.auth.backends.ModelBackend",
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Manila"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "static"

STATICFILES_DIRS = [BASE_DIR / "web" / "app" / "static"]

STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# Cache

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "TIMEOUT": None,
    }
}

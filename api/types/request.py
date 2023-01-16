from django.http.request import HttpRequest
from rest_framework.request import Request

PlainRequest = HttpRequest

RESTRequest = HttpRequest | Request

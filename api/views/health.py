from django.http.request import HttpRequest
from django.http.response import HttpResponse


def health(_request: HttpRequest):
    return HttpResponse("ok")

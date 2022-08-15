from django.conf import settings
from django.contrib import admin
from django.shortcuts import render
from django.urls import include, path, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api",
        TemplateView.as_view(template_name="api/swagger-ui.html", extra_context={"schema_url": "openapi-schema"}),
        name="swagger-ui",
    ),
    path("api/", include("api.urls")),
]

if settings.PYTHON_ENV != "production":
    urlpatterns.append(re_path(r"^.*/?$", lambda r: render(r, "index.html")))

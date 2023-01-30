from django.urls import path
from rest_framework.routers import SimpleRouter
from rest_framework.schemas import get_schema_view

from time_machine import __version__

from .views import CheckInViewSet, TagViewSet, TextLogViewSet

router = SimpleRouter(trailing_slash=False)
router.register("checkin", CheckInViewSet)
router.register("tag", TagViewSet)
router.register("textLog", TextLogViewSet)

urlpatterns = [
    path(
        "schema",
        get_schema_view(
            title="Time Machine API",
            version=__version__,
        ),
        name="openapi-schema",
    ),
    *router.urls,
]

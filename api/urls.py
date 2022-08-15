from django.urls import path
from rest_framework.routers import SimpleRouter
from rest_framework.schemas import get_schema_view

from time_machine import __version__

from .views import CheckInViewSet, admin_list_checkins, get_user, login, logout, refresh, signup

router = SimpleRouter(trailing_slash=False)
router.register("checkin", CheckInViewSet)

urlpatterns = [
    path(
        "schema",
        get_schema_view(
            title="Time Machine API",
            version=__version__,
        ),
        name="openapi-schema",
    ),
    path("auth/user", get_user),
    path("auth/signup", signup),
    path("auth/login", login),
    path("auth/logout", logout),
    path("auth/refresh", refresh),
    path("checkin/admin", admin_list_checkins),
    *router.urls,
]

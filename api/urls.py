from django.urls import path
from rest_framework.routers import SimpleRouter
from rest_framework.schemas import get_schema_view

from time_machine import __version__

from .views import (
    CheckInViewSet,
    admin_list_checkins,
    get_user,
    list_users,
    login,
    logout,
    refresh,
    signup,
    update_user_is_admin,
)

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
    path("user/<str:username>", update_user_is_admin),
    path("auth/user", get_user),
    path("auth/signup", signup),
    path("auth/login", login),
    path("auth/logout", logout),
    path("auth/refresh", refresh),
    path("checkin/admin", admin_list_checkins),
    path("users", list_users),
    *router.urls,
]

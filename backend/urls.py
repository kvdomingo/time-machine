from django.urls import include, path
from rest_framework import routers
from rest_framework_jwt.views import obtain_jwt_token
from knox.views import LogoutView
from . import views


# router = routers.DefaultRouter()
# router.register(r'checkins', views.CheckInViewset, basename='CheckIn')

urlpatterns = [
    path('auth/current-user', views.current_user),
    path('auth/users', views.UserList.as_view()),
    path('auth/token-auth', obtain_jwt_token),
    # path('api/', include(router.urls)),
]

from django.urls import include, path
from rest_framework_jwt.views import obtain_jwt_token
from . import views


urlpatterns = [
    path('auth/current-user', views.current_user),
    path('auth/users', views.UserList.as_view()),
    path('auth/token-auth', obtain_jwt_token),
    path('checkins', views.CheckInList.as_view()),
]

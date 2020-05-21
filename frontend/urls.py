from django.urls import path, re_path
from django.views.generic.base import TemplateView
from . import views


urlpatterns = [
    path('robots.txt', TemplateView.as_view(template_name='frontend/robots.txt', content_type='text/plain')),
    re_path(r'^.*/?$', views.index),
]

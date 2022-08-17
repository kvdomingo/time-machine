from django.http import HttpRequest
from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class IsAdmin(BasePermission):
    def has_permission(self, request: HttpRequest | Request, view):
        user = request.session.get("user")
        if not user:
            return False
        return user["is_admin"]

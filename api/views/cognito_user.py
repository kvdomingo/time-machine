from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as PasswordValidationError
from django.http import HttpRequest
from pydantic import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from ..cognito import cognito, get_users_from_cache, set_users_cache
from ..models import CognitoUser
from ..permissions import IsAdmin
from ..schemas import CognitoUser as CognitoUserSchema


@api_view()
@permission_classes([IsAdmin])
def list_users(req: HttpRequest | Request):
    user = req.session["user"]
    if not user["is_admin"]:
        return Response(status=status.HTTP_403_FORBIDDEN)
    users, err = cognito.list_users()
    if err is not None:
        return Response(err.error, status=err.status)
    return Response([u.dict() for u in users])


@api_view(["POST"])
@permission_classes([AllowAny])
def signup(req: Request):
    data = {k: v[0] for k, v in dict(req.data).items()}
    try:
        user = CognitoUserSchema(**data)
        if not data.get("password"):
            raise ValidationError
    except ValidationError as e:
        return Response(e.errors(), status=status.HTTP_400_BAD_REQUEST)
    password = data["password"]
    try:
        validate_password(password)
    except PasswordValidationError:
        return Response("Password is too weak or too common", status=status.HTTP_400_BAD_REQUEST)
    user, err = cognito.create_user(**user.dict(), password=password)
    if err:
        return Response(err.error, status=err.status)
    err = cognito.set_permanent_password(user, password)
    if err:
        return Response(err.error, status=err.status)
    CognitoUser.objects.create(**user.dict())
    if (cached := get_users_from_cache()) is not None:
        cached.append(user)
        set_users_cache(cached)
    return Response(user.dict(), status=status.HTTP_201_CREATED)


@api_view(["PATCH"])
@permission_classes([IsAdmin])
def update_user_is_admin(req: Request, username: str):
    data = req.data
    if not username or data.get("is_admin") is None:
        return Response("Username/attribute was not supplied", status=status.HTTP_400_BAD_REQUEST)
    if data["is_admin"]:
        update_func = cognito.make_admin
    else:
        update_func = cognito.remove_admin
    _, err = update_func(username)
    if err is not None:
        return Response(err.error, status=err.status)
    return Response(status=status.HTTP_204_NO_CONTENT)

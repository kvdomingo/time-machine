from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as PasswordValidationError
from pydantic import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from ..cognito import cognito, get_users_from_cache, set_users_cache
from ..models import CognitoUser as DBUser
from ..schemas import CognitoUser


@api_view(["POST"])
@permission_classes([AllowAny])
def signup(req: Request):
    data = {k: v[0] for k, v in dict(req.data).items()}
    try:
        user = CognitoUser(**data)
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
    DBUser.objects.create(**user)
    if (cached := get_users_from_cache()) is not None:
        cached.append(user)
        set_users_cache(cached)
    return Response(user.dict(), status=status.HTTP_201_CREATED)

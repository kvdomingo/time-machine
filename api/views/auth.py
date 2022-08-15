from datetime import datetime, timedelta

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from time_machine.log import logger

from ..auth import cognito_jwt_decode_handler
from ..cognito import cognito


@api_view(["POST"])
@permission_classes([AllowAny])
def login(req: Request):
    logger.info("HELLo")
    data = {k: v[0] for k, v in dict(req.data).items()}
    user, err = cognito.get_user(data["username"])
    if err:
        return Response(err.error, status=err.status)
    out, err = cognito.auth_user(**data)
    if err:
        return Response(err.error, status=err.status)
    result = out["AuthenticationResult"]
    token, refresh = result["IdToken"], result["RefreshToken"]
    decoded = cognito_jwt_decode_handler(token)
    user.is_admin = decoded["cognito:groups"][0] == "Admin"
    if not req.session.session_key:
        req.session.create()
    session_user = user.dict()
    req.session["user"] = session_user
    res = Response(session_user)
    res.set_cookie(
        "jwt",
        token,
        httponly=True,
        samesite="Strict",
        path="/",
        expires=datetime.utcnow() + timedelta(seconds=result["ExpiresIn"]),
    )
    res.set_cookie(
        "jwtrefresh",
        refresh,
        httponly=True,
        samesite="Strict",
        path="/api/auth",
    )
    return res


@api_view()
@permission_classes([AllowAny])
def refresh(req: Request):
    session_user = req.session.get("user")
    token = req.COOKIES.get("jwtrefresh")
    if not token:
        logger.error(f"msg: missing refresh token`")
        return Response({"Error": "Refresh token not found"}, status=status.HTTP_400_BAD_REQUEST)
    out, err = cognito.refresh_token(session_user["username"], token)
    if err:
        return Response(err.error, status=err.status)
    result = out["AuthenticationResult"]
    res = Response(session_user)
    res.set_cookie(
        "jwt",
        result["IdToken"],
        httponly=True,
        samesite="Strict",
        path="/",
        expires=datetime.utcnow() + timedelta(seconds=result["ExpiresIn"]),
    )
    return res


@api_view()
def logout(req: Request):
    token = req.COOKIES.get("jwtrefresh")
    if not token:
        logger.error(f"msg: missing refresh token")
        # do nothing if failed
    else:
        _, err = cognito.revoke_token(token)
        if err:
            logger.error(f"msg: error revoking token")
            # do nothing if failed
    req.session.flush()
    res = Response(status=status.HTTP_204_NO_CONTENT)
    res.delete_cookie(
        "jwt",
        path="/",
        samesite="Strict",
    )
    res.delete_cookie(
        "jwtrefresh",
        path="/api/auth",
        samesite="Strict",
    )
    return res


@api_view()
def get_user(req: Request):
    user = req.session.get("user")
    if not user:
        return Response({"Error": "User not logged in"}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(user)

from typing import Any

from django.conf import settings
from rest_framework import status

from time_machine.aws import get_client
from time_machine.log import logger

from ..models import CognitoUser
from ..schemas import AwsError
from ..schemas import CognitoUser as UserSchema
from ..serializers import CognitoUserSerializer
from .utils import generate_hash, get_users_from_cache, set_users_cache


class CognitoHandler:
    def __init__(self):
        self.client = get_client("cognito-idp")
        self.user_pool = settings.COGNITO_USER_POOL_ID
        self.client_id = settings.COGNITO_CLIENT_ID
        self.client_secret = settings.COGNITO_CLIENT_SECRET

    @staticmethod
    def map_to_attributes(attributes: dict[str, str]) -> list[dict[str, str]]:
        return [{"Name": key, "Value": value} for key, value in attributes.items()]

    @staticmethod
    def extract_attribute(user_attributes: list, attribute: str) -> str:
        return next(attr["Value"] for attr in user_attributes if attr["Name"] == attribute)

    def create_user(
        self, email: str, username: str, password: str = None, **kwargs
    ) -> tuple[UserSchema | None, AwsError | None]:
        model_users = CognitoUser.objects.all()
        if len(model_users.filter(username=username, email=email)) > 0:
            return None, AwsError(
                error=f"That combination of username and email already exists", status=status.HTTP_400_BAD_REQUEST
            )
        # Leave password as None to let Cognito auto-generate the password
        body = {
            "UserPoolId": self.user_pool,
            "Username": username,
            "UserAttributes": self.map_to_attributes(dict(email=email, email_verified=str(True))),
        }
        if password is not None:
            body["TemporaryPassword"] = password
        try:
            res = self.client.admin_create_user(**body)
            user = res["User"]
            self.client.admin_add_user_to_group(
                UserPoolId=self.user_pool,
                Username=user["Username"],
                GroupName="Admin" if kwargs.get("is_admin") else "NonAdmin",
            )
            user = UserSchema(
                **{
                    **kwargs,
                    "username": user["Username"],
                    "email": self.extract_attribute(user["Attributes"], "email"),
                    "id": self.extract_attribute(user["Attributes"], "sub"),
                }
            )
            return user, None
        except self.client.exceptions.UsernameExistsException:
            error_string = f"User {username} already exists"
            logger.error(error_string)
            return None, AwsError(error=error_string, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(str(e))
            return None, AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def set_permanent_password(self, user: UserSchema, password: str) -> AwsError | None:
        try:
            self.client.admin_set_user_password(
                UserPoolId=self.user_pool,
                Username=user.username,
                Password=password,
                Permanent=True,
            )
            return None
        except Exception as e:
            logger.error(str(e))
            return AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list_users(self) -> tuple[list[UserSchema], AwsError | None]:
        if (cached := get_users_from_cache()) is not None:
            return cached, None
        try:
            users_list = []
            for group in ["Admin", "NonAdmin"]:
                res = self.client.list_users_in_group(UserPoolId=self.user_pool, GroupName=group)
                users = res["Users"]
                users = [
                    {
                        "id": self.extract_attribute(user["Attributes"], "sub"),
                        "username": user["Username"],
                        "email": self.extract_attribute(user["Attributes"], "email"),
                        "is_active": user["Enabled"],
                        "is_admin": group == "Admin",
                    }
                    for user in users
                ]
                users_list.extend([UserSchema(**user) for user in users])
            model_users = CognitoUser.objects.filter(is_active=False)
            for model_user in model_users:
                users_list.append(UserSchema(**CognitoUserSerializer(model_user).data))
            users_list = sorted(users_list, key=lambda u: u.is_active)
            set_users_cache(users_list)
            return users_list, None
        except Exception as e:
            logger.error(str(e))
            return [], AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def auth_user(self, username: str, password: str) -> tuple[Any | None, AwsError | None]:
        try:
            res = self.client.admin_initiate_auth(
                UserPoolId=self.user_pool,
                ClientId=self.client_id,
                AuthFlow="ADMIN_USER_PASSWORD_AUTH",
                AuthParameters={
                    "USERNAME": username,
                    "PASSWORD": password,
                    "SECRET_HASH": generate_hash(username),
                },
            )
            return res, None
        except Exception as e:
            logger.exception(e)
            return None, AwsError(error=str(e), status=status.HTTP_424_FAILED_DEPENDENCY)

    def get_user(self, username: str) -> tuple[UserSchema | None, AwsError | None]:
        if (cached := get_users_from_cache()) is not None:
            try:
                user = next(user for user in cached if user.username == username)
                return user, None
            except StopIteration:
                return None, AwsError(error=f"Incorrect username and/or password", status=status.HTTP_400_BAD_REQUEST)
        try:
            res = self.client.admin_get_user(
                UserPoolId=self.user_pool,
                Username=username,
            )
            user = UserSchema(
                **{
                    "username": res["Username"],
                    "email": self.extract_attribute(res["UserAttributes"], "email"),
                    "id": self.extract_attribute(res["UserAttributes"], "sub"),
                }
            )
            return user, None
        except self.client.exceptions.UserNotFoundException:
            return None, AwsError(error=f"Incorrect username and/or password", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(str(e))
            return None, AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def refresh_token(self, username: str, token: str) -> tuple[Any | None, AwsError | None]:
        try:
            res = self.client.admin_initiate_auth(
                AuthFlow="REFRESH_TOKEN_AUTH",
                AuthParameters={
                    "REFRESH_TOKEN": token,
                    "SECRET_HASH": generate_hash(username),
                },
                UserPoolId=self.user_pool,
                ClientId=self.client_id,
            )
            return res, None
        except Exception as e:
            logger.exception(e)
            return None, AwsError(error=str(e), status=status.HTTP_424_FAILED_DEPENDENCY)

    def revoke_token(self, token: str) -> tuple[Any | None, AwsError | None]:
        try:
            res = self.client.revoke_token(Token=token, ClientId=self.client_id, ClientSecret=self.client_secret)
            return res, None
        except Exception as e:
            logger.error(str(e))
            return None, AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def disable_user(self, username: str) -> tuple[Any | None, AwsError | None]:
        if not username:
            return None, AwsError(error="Username was not provided", status=status.HTTP_400_BAD_REQUEST)
        try:
            res = self.client.admin_disable_user(UserPoolId=self.user_pool, Username=username)
            return res, None
        except Exception as e:
            logger.error(str(e))
            return None, AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def enable_user(self, username: str) -> tuple[Any | None, AwsError | None]:
        if not username:
            return None, AwsError(error="Username was not provided", status=status.HTTP_400_BAD_REQUEST)
        try:
            res = self.client.admin_enable_user(UserPoolId=self.user_pool, Username=username)
            return res, None
        except Exception as e:
            logger.error(str(e))
            return None, AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete_user(self, username: str) -> tuple[Any | None, AwsError | None]:
        if not username:
            return None, AwsError(error="Username was not provided", status=status.HTTP_400_BAD_REQUEST)
        try:
            res = self.client.admin_delete_user(
                UserPoolId=self.user_pool,
                Username=username,
            )
            return res, None
        except self.client.exceptions.UserNotFoundException:
            return None, AwsError(error=f"User {username} not found", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(str(e))
            return None, AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def request_reset_password(self, username: str) -> AwsError | None:
        if not username:
            return AwsError(error="Username was not provided", status=status.HTTP_400_BAD_REQUEST)
        try:
            self.client.admin_reset_user_password(UserPoolId=self.user_pool, Username=username)
            return None
        except self.client.exceptions.UserNotFoundException:
            return AwsError(error=f"User {username} not found", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(str(e))
            return AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def confirm_reset_password(self, username: str, password: str, confirmation_code: str) -> AwsError | None:
        if not username:
            return AwsError(error="Username was not provided", status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return AwsError(error="New password was not provided", status=status.HTTP_400_BAD_REQUEST)
        if not confirmation_code:
            return AwsError(error="Incorrect or no confirmation code was provided", status=status.HTTP_400_BAD_REQUEST)
        try:
            self.client.confirm_forgot_password(
                ClientId=self.client_id,
                SecretHash=generate_hash(username),
                Username=username,
                ConfirmationCode=confirmation_code,
                Password=password,
            )
            return None
        except (self.client.exceptions.CodeMismatchException, self.client.exceptions.ExpiredCodeException):
            return AwsError(
                error={
                    "code": "InvalidCode",
                    "message": "Incorrect or expired confirmation code.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.error(str(e))
            return AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def make_admin(self, username: str):
        try:
            self.client.admin_add_user_to_group(
                UserPoolId=self.user_pool,
                Username=username,
                GroupName="Admin",
            )
            self.client.admin_remove_user_from_group(
                UserPoolId=self.user_pool,
                Username=username,
                GroupName="NonAdmin",
            )
            return None, None
        except Exception as e:
            logger.error(str(e))
            return None, AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def remove_admin(self, username: str):
        try:
            self.client.admin_add_user_to_group(
                UserPoolId=self.user_pool,
                Username=username,
                GroupName="NonAdmin",
            )
            self.client.admin_remove_user_from_group(
                UserPoolId=self.user_pool,
                Username=username,
                GroupName="Admin",
            )
            return None, None
        except Exception as e:
            logger.error(str(e))
            return None, AwsError(error=str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


cognito = CognitoHandler()

import json

from django.core.cache import cache

from time_machine.log import logger

from ..cognito import cognito
from ..models import CognitoUser


def sync_cognito_users() -> bool:
    cognito_users, e = cognito.list_users()
    if e:
        logger.warning(f"Setting user cache failed, skipping: {e}")
        return True
    for cognito_user in cognito_users:
        cognito_user = cognito_user.dict()
        id_ = cognito_user.pop("id")
        CognitoUser.objects.update_or_create(id=id_, defaults=cognito_user)
    db_users = CognitoUser.objects.all()
    for db_user in db_users:
        if str(db_user.id) not in [str(u.id) for u in cognito_users]:
            db_user.delete()
    cache.set("cognito_users", json.dumps([user.dict() for user in cognito_users]), timeout=60 * 5)
    return False


def startup():
    sync_cognito_users()
    logger.info("Startup tasks completed.")

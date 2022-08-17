import json
import os
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "time_machine.settings")

import django

django.setup()

from api.models import CognitoUser
from api.serializers import CheckInSerializer
from time_machine.log import logger


def main():
    with open(Path(__file__).parent / "data.json", "r") as f:
        data = json.load(f)
    user = CognitoUser.objects.get(username="kvdomingo")
    user_id = user.id
    logger.info(f"Retrieved user with id {user.id}")
    data = [{**d, "author": user_id} for d in data]
    serializer = CheckInSerializer(data=data, many=True)
    logger.info(f"Starting bulk validation...")
    serializer.is_valid()
    logger.info(f"Starting bulk operation...")
    serializer.save()


if __name__ == "__main__":
    main()

import boto3
from botocore.config import Config
from django.conf import settings

config = Config(
    region_name=settings.AWS_REGION,
)


def get_client(service_name: str):
    return boto3.client(service_name, config=config)

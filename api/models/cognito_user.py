import uuid

from django.db import models

from .utils import get_timestamp


class CognitoUser(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True, editable=False)
    created = models.PositiveBigIntegerField(default=get_timestamp)
    updated = models.PositiveBigIntegerField(default=get_timestamp)
    username = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    class Meta:
        unique_together = ["username", "email"]

    def save(self, *args, **kwargs):
        self.updated = get_timestamp()
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.id)

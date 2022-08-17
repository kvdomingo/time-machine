from uuid import uuid4

from django.db import models

from .utils import get_timestamp


class CheckIn(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, unique=True, editable=False)
    created = models.PositiveBigIntegerField(default=get_timestamp)  # should normally be uneditable
    modified = models.PositiveBigIntegerField(default=get_timestamp, editable=False)
    duration = models.FloatField()
    tag = models.CharField(max_length=64)
    activities = models.CharField(max_length=255)
    author = models.ForeignKey("CognitoUser", related_name="checkins", on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.modified = get_timestamp()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ["-created"]
        verbose_name = "Check in"
        verbose_name_plural = "Check ins"

    def __str__(self):
        hour = "hr" if self.duration == 1 else "hrs"
        return f"{self.duration} {hour} #{self.tag} {self.activities}"

from uuid import uuid4

from django.db import models


class CheckIn(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, unique=True, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    duration = models.FloatField()
    start_time = models.TimeField()
    record_date = models.DateField()
    tag = models.CharField(max_length=64)
    activities = models.CharField(max_length=256)

    class Meta:
        ordering = ["-record_date", "-start_time"]
        verbose_name = "Check in"
        verbose_name_plural = "Check ins"

    def __str__(self):
        hour = "hr" if self.duration == 1 else "hrs"
        return f"{self.duration} {hour} #{self.tag} {self.activities}"

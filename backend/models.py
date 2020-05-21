from django.db import models
from django.contrib.auth.models import User


class CheckIn(models.Model):
    author = models.ForeignKey(
        User,
        related_name='checkins',
        on_delete=models.CASCADE,
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    duration = models.FloatField()
    tag = models.CharField(max_length=64)
    activities = models.CharField(max_length=255)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        hour = 'hr' if self.duration == 1 else 'hrs'
        return f'{self.duration} {hour} #{self.tag} {self.activities}'

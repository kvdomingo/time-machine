from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from ..models import CheckIn


class CheckInSerializer(ModelSerializer):
    author = SerializerMethodField()

    class Meta:
        model = CheckIn
        fields = "__all__"

    def get_author(self, obj: CheckIn):
        return obj.author.username

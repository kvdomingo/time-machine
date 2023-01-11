from rest_framework.serializers import ModelSerializer

from ..models import CheckIn


class CheckInSerializer(ModelSerializer):
    class Meta:
        model = CheckIn
        fields = "__all__"

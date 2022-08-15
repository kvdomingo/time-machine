from rest_framework.serializers import ModelSerializer

from ..models import CognitoUser


class CognitoUserSerializer(ModelSerializer):
    class Meta:
        model = CognitoUser
        fields = "__all__"

from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer, SerializerMethodField


class UserSerializer(ModelSerializer):
    is_admin = SerializerMethodField()

    class Meta:
        model = User
        fields = ["username", "email", "is_active", "is_admin"]

    def get_is_admin(self, obj: User):
        return obj.groups.filter(name="Admin").exists()

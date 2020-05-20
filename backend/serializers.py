"""
The scripts in this file serializes the models, i.e., converts them into a
JSON-representable object (one can also use XML, YAML) that can be
communicated to and understood by the frontend.
"""

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.settings import api_settings
from .models import CheckIn


# Ensure that emails used for signing up are unique. Django does not
# enforce this by default.
User._meta.get_field('email')._unique = True


class UserSerializer(serializers.ModelSerializer):
    """ Serializes non-sensitive information about the currently logged-in user"""
    class Meta:
        model = User
        fields = ['username', 'id', 'email']


class UserSerializerWithToken(serializers.ModelSerializer):
    """ Serializes login information for a newly-created user """
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        """ We use JWT for handling sessions """
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ['token', 'id', 'email', 'username', 'password']


class CheckInSerializer(serializers.ModelSerializer):
    """ Serializes check-in information for each user """
    def create(self, validated_data):
        instance = self.Meta.model(**validated_data)
        instance.save()
        return instance

    class Meta:
        model = CheckIn
        fields = '__all__'

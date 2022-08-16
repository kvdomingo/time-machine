from django.contrib import admin

from .models import CheckIn, CognitoUser

admin.site.register(CheckIn)
admin.site.register(CognitoUser)

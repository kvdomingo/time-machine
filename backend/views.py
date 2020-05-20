from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CheckIn
from .serializers import *


@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckInList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        checkins = CheckIn.objects.filter(author__username=request.user).order_by('-created')
        serializer = CheckInSerializer(checkins, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request, format=None):
        serializer = CheckInSerializer(data=request.data)
        if serializer.is_valid():
            checkin = serializer.save()
            if checkin:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        data = CheckIn.objects.get(pk=request.data['id']).delete()
        return JsonResponse(data, safe=False)

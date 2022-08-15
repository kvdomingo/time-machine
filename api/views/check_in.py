from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import CheckIn
from ..serializers import CheckInSerializer


class CheckInViewSet(ModelViewSet):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.session["user"]["id"] != instance.author.id:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.session["user"]["id"] != instance.author.id:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def list(self, request: Request, *args, **kwargs):
        queryset = CheckIn.objects.filter(author=request.session["user"]["id"]).all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def create(self, request: Request, *args, **kwargs):
        request.data.update({"author": request.session["user"]["id"]})
        return super().create(request, *args, **kwargs)


@api_view()
def admin_list_checkins(request: Request):
    user = request.session["user"]
    if not user["is_admin"]:
        return Response(status=status.HTTP_403_FORBIDDEN)
    queryset = CheckIn.objects.all()
    serializer = CheckInSerializer(queryset, many=True)
    return Response(serializer.data)

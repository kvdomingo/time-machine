from rest_framework.viewsets import ModelViewSet

from ..models import CheckIn
from ..serializers import CheckInSerializer


class CheckInViewSet(ModelViewSet):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer

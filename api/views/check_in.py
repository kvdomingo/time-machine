from datetime import datetime

from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import QuerySet, Sum
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from ..models import CheckIn
from ..serializers import CheckInSerializer
from ..types import RESTRequest


class CheckInViewSet(ModelViewSet):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer


class TextLogViewSet(GenericViewSet):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer
    pagination_class = None

    def list(self, request: RESTRequest, *args, **kwargs):
        record_date = request.GET.get("record_date")
        if not record_date:
            record_date = timezone.now()
        else:
            record_date = timezone.make_aware(datetime.strptime(record_date, "%Y-%m-%d"))
        queryset: QuerySet[CheckIn] = self.get_queryset().filter(
            record_date__year=record_date.year, record_date__month=record_date.month, record_date__day=record_date.day
        )
        queryset_unique_tags = queryset.values("tag").annotate(
            duration=Sum("duration"), activities=ArrayAgg("activities", distinct=True)
        )
        return Response(queryset_unique_tags)

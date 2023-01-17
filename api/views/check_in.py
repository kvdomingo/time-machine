from datetime import datetime, timedelta

from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import QuerySet, Sum
from django.utils import timezone
from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from ..models import CheckIn
from ..serializers import CheckInSerializer
from ..types import RESTRequest


class CheckInFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="record_date", lookup_expr="gte")
    end_date = filters.DateFilter(field_name="record_date", lookup_expr="lte")

    class Meta:
        model = CheckIn
        fields = ["record_date"]


class CheckInViewSet(ModelViewSet):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer
    filterset_class = CheckInFilter


class TextLogViewSet(GenericViewSet):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer
    pagination_class = None

    def list(self, request: RESTRequest):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        if not start_date:
            start_date = timezone.now()
        else:
            start_date = timezone.make_aware(datetime.strptime(start_date, "%Y-%m-%d"))
        if not end_date:
            end_date = timezone.now()
        else:
            end_date = timezone.make_aware(datetime.strptime(end_date, "%Y-%m-%d"))
        queryset: QuerySet[CheckIn] = self.get_queryset().filter(
            record_date__gte=start_date,
            record_date__lte=end_date,
        )
        number_of_days = (end_date - start_date).days + 1
        response = {}
        for n in range(number_of_days):
            record_date = start_date + timedelta(days=n)
            qs = queryset.all().filter(record_date=record_date)
            queryset_unique_tags = qs.values("tag").annotate(
                duration=Sum("duration"), activities=ArrayAgg("activities", distinct=True)
            )
            response[record_date.strftime("%Y-%m-%d")] = queryset_unique_tags
        return Response(response)

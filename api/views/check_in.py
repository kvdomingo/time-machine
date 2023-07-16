from ast import literal_eval
from datetime import datetime, timedelta

from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models import QuerySet, Sum
from django.utils import timezone
from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from api.models import CheckIn
from api.serializers import CheckInSerializer
from api.types import RESTRequest

DEFAULT_DATE_FORMAT = "%Y-%m-%d"


class CheckInFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="record_date", lookup_expr="gte")
    end_date = filters.DateFilter(field_name="record_date", lookup_expr="lte")

    class Meta:
        model = CheckIn
        fields = ["record_date", "tag"]


class CheckInViewSet(ModelViewSet):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer
    filterset_class = CheckInFilter


class TagViewSet(GenericViewSet):
    queryset = CheckIn.objects.all()
    pagination_class = None

    def list(self, request: RESTRequest):
        queryset: QuerySet[CheckIn] = self.get_queryset()
        qs_unique_tags = queryset.all().values_list("tag", flat=True)
        response = sorted(list(set(qs_unique_tags)))
        return Response(response)


class TextLogViewSet(GenericViewSet):
    queryset = CheckIn.objects.all()
    serializer_class = CheckInSerializer
    pagination_class = None

    def list(self, request: RESTRequest):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        tag = request.GET.get("tag")
        combine_tags = request.GET.get("combine_tags", "false") == "true"

        if not start_date:
            start_date = timezone.now()
        else:
            start_date = timezone.make_aware(
                datetime.strptime(start_date, DEFAULT_DATE_FORMAT)
            )
        if not end_date:
            end_date = timezone.now()
        else:
            end_date = timezone.make_aware(
                datetime.strptime(end_date, DEFAULT_DATE_FORMAT)
            )

        queryset: QuerySet[CheckIn] = self.get_queryset().filter(
            record_date__gte=start_date,
            record_date__lte=end_date,
        )

        if tag:
            queryset = queryset.filter(tag__iexact=tag)

        number_of_days = (end_date - start_date).days + 1
        response = {}
        for n in range(number_of_days):
            record_date = start_date + timedelta(days=n)
            qs = queryset.all().filter(record_date=record_date)

            if combine_tags:
                result = qs.values("tag").annotate(
                    duration=Sum("duration"),
                    activities=ArrayAgg("activities", distinct=True),
                )
            else:
                result = (
                    qs.values("tag", "duration")
                    .annotate(activities=ArrayAgg("activities"))
                    .order_by("start_time")
                )

            response[record_date.strftime(DEFAULT_DATE_FORMAT)] = result
        return Response(response)

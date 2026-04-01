from series.models import Series
from core.randomString import is_number
from django.db.models import F


def filters(queryset, request):
    seriesObjects = queryset
    if "type" in request.query_params:
        filters = request.query_params["type"].split(",")
        filters = list(filter(lambda filter: filter.strip(), filters))
        print(filters)

        if "-3" in filters:
            if "-4" not in filters:
                seriesObjects = Series.objects.filter(is_discontinued=False)
            filters = list(filter(lambda t: t != "-3", filters))

        if "-4" in filters:
            seriesObjects = Series.objects.filter(is_discontinued=True)
            filters = list(filter(lambda t: t != "-4", filters))

        if "-1" in filters:
            seriesObjects = seriesObjects.exclude(n_volumes=F("volumes_bought"))
            filters = list(filter(lambda t: t != "-1", filters))

        if "-2" in filters:
            seriesObjects = seriesObjects.exclude(volumes_read=F("volumes_bought"))
            filters = list(filter(lambda t: t != "-2", filters))

        if len(filters) > 0:
            seriesObjects = seriesObjects.filter(
                typology__in=list(map(int, filter(is_number, filters)))
            )

    if "publisher" in request.query_params:
        filters = request.query_params["publisher"].split(",")
        filters = list(filter(lambda filter: filter.strip(), filters))
        seriesObjects = seriesObjects.filter(
            publisher__in=list(map(int, filter(is_number, filters)))
        )

    if "filterbyname" in request.query_params:
        seriesObjects = seriesObjects.filter(
            name__contains=request.query_params["filterbyname"]
        )
    return seriesObjects

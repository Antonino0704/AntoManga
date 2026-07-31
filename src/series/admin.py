from django.contrib import admin
from django.contrib.admin import SimpleListFilter
from series.models import Series, Typology

from django.urls import reverse
from django.utils.html import format_html


class SeriesAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "n_volumes",
        "volumes_bought",
        "missed_volumes",
        "volumes_read",
        "publisher_display",
        "typology_display",
        "owner_display",
    ]

    list_filter = ["owner", "publisher", "typology", "purchased_at", "is_discontinued"]
    search_fields = ["name"]

    fieldsets = (
        (
            None,
            {
                "fields": ("name", "image", "is_discontinued", "purchased_at"),
            },
        ),
        (
            "STATS",
            {
                "fields": (
                    "n_volumes",
                    "volumes_bought",
                    "volumes_read",
                ),
            },
        ),
        (
            "Publisher & Typology",
            {
                "fields": (
                    "publisher",
                    "typology",
                ),
            },
        ),
    )

    def publisher_display(self, obj):
        link = reverse("admin:publishers_publisher_change", args=[obj.publisher.id])
        return format_html('<a href="{}">{}</a>', link, obj.publisher)

    def typology_display(self, obj):
        link = reverse("admin:series_typology_change", args=[obj.typology.id])
        return format_html('<a href="{}">{}</a>', link, obj.typology)

    def owner_display(self, obj):
        link = reverse("admin:auth_user_change", args=[obj.owner.id])
        return format_html('<a href="{}">{}</a>', link, obj.owner)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.owner = request.user
        return super().save_model(request, obj, form, change)


admin.site.register(Typology)
admin.site.register(Series, SeriesAdmin)

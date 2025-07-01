from django.contrib import admin
from publishers.models import Publisher


class PublisherAdmin(admin.ModelAdmin):
    list_display = ["name", "description_preview"]
    search_fields = ["name"]

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "description",
                    "image",
                ),
            },
        ),
    )

    def description_preview(self, obj):
        return f"{obj.description[:50]}..."


admin.site.register(Publisher, PublisherAdmin)

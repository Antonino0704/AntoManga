from django.contrib import admin

from users.models import InviteToken

from django.urls import reverse
from django.utils.html import format_html


class InviteTokenAdmin(admin.ModelAdmin):
    list_display = ["token", "is_valid", "author", "link"]
    readonly_fields = [
        "token",
        "date_of_use",
        "author",
        "new_user",
    ]

    list_filter = ["expire", "author"]

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "token",
                    "expire",
                ),
            },
        ),
        (
            "USE",
            {
                "fields": (
                    "new_user",
                    "date_of_use",
                ),
            },
        ),
        (
            "Author",
            {
                "fields": ("author",),
            },
        ),
    )

    def author_display(self, obj):
        link = reverse("admin:auth_user_change", args=[obj.author.id])
        return format_html('<a href="{}">{}</a>', link, obj.author)

    def link(self, obj):
        link = f"{self.publicDomain}/invite/{obj.token}"
        return format_html(
            '<a href="#" onclick="navigator.clipboard.writeText(\'{}\'); return false;">link</a>',
            link,
        )

    def is_valid(self, obj):
        return not obj.expire

    is_valid.boolean = True

    def get_queryset(self, request):
        self.publicDomain = f"{request.scheme}{request.get_host()}"
        return super().get_queryset(request)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.author = request.user
        return super().save_model(request, obj, form, change)


admin.site.register(InviteToken, InviteTokenAdmin)

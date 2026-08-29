from django.contrib import admin

from users.models import InviteToken, Ticket

from django.urls import reverse
from django.utils.html import format_html


class InviteTokenAdmin(admin.ModelAdmin):
    list_display = ["token", "is_valid", "author_display", "link"]
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
            "Usage Details",
            {
                "fields": (
                    "new_user",
                    "date_of_use",
                ),
            },
        ),
        (
            "Author Information",
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
        self.publicDomain = f"{request.scheme}://{request.get_host()}"
        return super().get_queryset(request)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.author = request.user
        return super().save_model(request, obj, form, change)


class TicketAdmin(admin.ModelAdmin):
    list_display = [
        "title_preview",
        "description_preview",
        "label_display",
        "status_display",
    ]
    readonly_fields = [
        "id",
        "title",
        "description",
        "author",
        "email",
        "date",
    ]

    list_filter = ["label", "status", "date"]

    fieldsets = (
        (
            "User Info",
            {
                "fields": (
                    "email",
                    "author",
                ),
            },
        ),
        (
            "Details",
            {
                "fields": (
                    "id",
                    "title",
                    "description",
                    "date",
                ),
            },
        ),
        (
            "Admin Section",
            {
                "fields": (
                    "label",
                    "status",
                ),
            },
        ),
    )

    def title_preview(self, obj):
        if len(obj.title) <= 10:
            return obj.title
        return f"{obj.title[:10]}..."

    def description_preview(self, obj):
        if len(obj.description) <= 10:
            return obj.description
        return f"{obj.description[:10]}..."

    def label_display(self, obj):
        if obj.label == "bug":
            return format_html(f'<p style="color: red;">{obj.label}</p>')
        elif obj.label == "feature":
            return format_html(f'<p style="color: green;">{obj.label}</p>')

    def status_display(self, obj):
        if obj.status:
            return format_html(f'<p style="color: green;">Closed</p>')
        return format_html(f'<p style="color: red;">Open</p>')

    def has_add_permission(self, request, obj=None):
        return False


admin.site.register(InviteToken, InviteTokenAdmin)
admin.site.register(Ticket, TicketAdmin)

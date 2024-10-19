from django import template
from django.conf import settings
from django.utils.safestring import mark_safe

register = template.Library()

@register.simple_tag
def render_settings_value():
    if settings.BETA:
        beta_alert = """<div class="alert alert-info container-sm mt-2" role="alert">
        <i class="bi bi-info-circle"></i> BETA VERSION
        </div>"""
        return mark_safe(beta_alert)
    return mark_safe("")
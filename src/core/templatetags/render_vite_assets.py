import json
import os
import socket

from django import template
from django.conf import settings
from django.utils.safestring import mark_safe

register = template.Library()

base_path = (
    socket.gethostbyname_ex(socket.gethostname())[2][1]
    if settings.VITE_NETWORK
    else "localhost"
)


@register.simple_tag
def render_vite_assets():
    if settings.VITE_LIVE_SERVER:
        return mark_safe(f"""
            <script type='module' src='http://{base_path}:5173/@vite/client'>
            </script><script type='module' src='http://{base_path}:5173/src/main.ts'></script>
            """)
    manifest_json_path = os.path.join(
        settings.VITE_STATIC_BUNDLE, ".vite", "manifest.json"
    )
    try:
        with open(manifest_json_path, "r") as f:
            manifest = json.load(f)
            payload = f"""<script type="module" src="/static/{settings.VITE_BUILD_DIRNAME}/{manifest['index.html']['file']}"></script>"""
            if "css" in manifest["index.html"].keys():
                payload += f"""<link rel="stylesheet" type="text/css" href="/static/{settings.VITE_BUILD_DIRNAME}/{manifest['index.html']['css'][0]}" />"""
            return mark_safe(payload)
    except Exception as e:
        raise Exception(f"Error loading {manifest_json_path} - {e}") from e

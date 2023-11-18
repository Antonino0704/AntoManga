from django.apps import AppConfig


class SeriesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'series'

    def ready(self):
        import series.signals

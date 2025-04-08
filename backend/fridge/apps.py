from django.apps import AppConfig

class FridgeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'fridge'

    def ready(self):
        import fridge.signals  # Register the signal
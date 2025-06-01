"Файл конфигурации приложения workers."

from django.apps import AppConfig


class WorkersConfig(AppConfig):
    """Конфигурация приложения workers."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'workers'
    verbose_name = 'Работники'

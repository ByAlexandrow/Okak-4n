"Файл конфигурации приложения tasks."

from django.apps import AppConfig


class TasksConfig(AppConfig):
    """Конфигурация приложения tasks."""

    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tasks'
    verbose_name = 'Задачи'

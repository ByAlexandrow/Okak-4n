"""Модели приложения задач."""

from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

from tasks.utils import upload_to_path, validate_file_extension


class TaskStatus(models.Model):
    """Модель статуса выполнения задачи."""

    title = models.CharField(
        max_length=50,
        verbose_name='Статус выполнения задачи',
    )
    is_published = models.BooleanField(
        default=False,
        verbose_name='Опубликовать',
    )

    def __str__(self):
        return str(self.title)

    class Meta:
        """Meta класс для модели TaskStatus."""

        verbose_name = 'Статус задачи'
        verbose_name_plural = 'Статусы задач'


class WorkDirection(models.Model):
    """Модель направления работы."""

    title = models.CharField(
        max_length=50,
        verbose_name='Направление',
    )
    tech_stack = models.CharField(
        max_length=300,
        null=True,
        blank=True,
        verbose_name='Стек технологий',
    )
    team = models.ForeignKey(
        'workers.Team',
        on_delete=models.CASCADE,
        verbose_name='Команда',
    )
    is_published = models.BooleanField(
        default=False,
        verbose_name='Опубликовать',
    )

    def __str__(self):
        return str(self.title)

    class Meta:
        """Meta класс для модели WorkDirection."""

        verbose_name = 'Направление задачи'
        verbose_name_plural = 'Направление задач'


class Task(models.Model):
    """Модель задачи."""

    title = models.CharField(
        max_length=100,
        verbose_name='Название задачи',
    )
    description = models.TextField(
        max_length=200,
        verbose_name='Описание задачи',
    )
    direction = models.ForeignKey(
        WorkDirection,
        on_delete=models.CASCADE,
        verbose_name='Направление работы',
    )
    deadline = models.DateField(
        verbose_name='Дедлайн',
    )
    status = models.ForeignKey(
        TaskStatus,
        on_delete=models.CASCADE,
        null=True,
        verbose_name='Статус задачи',
    )
    team = models.ForeignKey(
        'workers.Team',
        on_delete=models.CASCADE,
        verbose_name='Команда',
    )
    worker = models.ManyToManyField(
        'workers.Worker',
        verbose_name='Исполнители',
    )
    price = models.IntegerField(
        verbose_name='Стоимость проекта',
    )
    complexity = models.IntegerField(
        verbose_name='Сложность проекта',
    )
    link = models.TextField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name='Дополнительные ссылки',
    )
    created_at = models.DateField(
        auto_now_add=True,
        verbose_name='Дата создания',
    )

    def clean(self):
        """Проверка, что дедлайн не в прошлом."""
        super().clean()
        if self.deadline < timezone.localdate():
            raise ValidationError(
                {'deadline': 'Дедлайн не может быть в прошлом!'}
            )

    def __str__(self):
        return str(self.title)

    class Meta:
        """Meta класс для модели Task."""

        indexes = [
            models.Index(fields=['title', 'direction', 'deadline', 'status']),
        ]
        ordering = ['-created_at']
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'


class TaskFile(models.Model):
    """Модель загрузки файлов к модели Task."""

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name='Задача',
    )
    file = models.FileField(
        upload_to=upload_to_path,
        validators=[validate_file_extension],
        verbose_name='Файл',
    )
    uploaded_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата загрузки',
    )

    def __str__(self):
        return self.file.name


class SubTask(models.Model):
    """Модель для добавления подзадач к модели SubTask."""

    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='subtasks',
        verbose_name='Подзадача',
    )
    title = models.CharField(
        max_length=100,
        verbose_name='Название подзадачи',
    )
    description = models.TextField(
        max_length=200,
        blank=True,
        verbose_name='Описание подзадачи',
    )
    is_completed = models.BooleanField(
        default=False,
        verbose_name='Выполнена',
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания',
    )

    def clean(self):
        if not self.pk:
            if self.task_id is None:
                return
            if self.task.subtasks.count() >= 8:
                raise ValidationError('Нельзя добавить больше 8 подзадач к одной задаче.')

    def __str__(self):
        return str(self.title)

    class Meta:
        """Класс Meta для модели SubTask."""

        verbose_name = 'Подзадача'
        verbose_name_plural = 'Подзадачи'

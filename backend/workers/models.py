"""Файл моделей команды и пользователя."""

from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.exceptions import ObjectDoesNotExist

from tasks.models import TaskStatus, Task


class Team(models.Model):
    """Модель команды исполнителей."""

    title = models.CharField(
        max_length=50,
        null=False,
        blank=False,
        verbose_name='Направление команды'
    )
    description = models.CharField(
        max_length=150,
        null=True,
        blank=True,
        verbose_name='Описание',
    )
    members = models.IntegerField(
        default=0,
        verbose_name='Количество исполнителей',
    )
    availability = models.IntegerField(
        default=100,
        verbose_name='Доступность (%)',
    )
    is_published = models.BooleanField(
        default=False,
        verbose_name='Опубликовать',
    )

    def __str__(self):
        return str(self.title)

    @property
    def active_projects(self):
        """ Функция вычисления количества активных задач команды."""

        members = self.workers.all()

        try:
            done_status = TaskStatus.objects.filter(title__iexact='завершено').first('id')
        except ObjectDoesNotExist:
            done_status = None

        qs = Task.objects.filter(worker__in=members)

        if done_status:
            qs = qs.exclude(status=done_status)

        return qs.distinct().count()

    def active_projects_per_member(self):
        """Функция возвращает словарь {worker: количество_активных_задач}."""

        result = {}
        try:
            done_status = TaskStatus.objects.filter(title__iexact='завершено').latest('id')
        except ObjectDoesNotExist:
            done_status = None

        for worker in self.workers.all():
            qs = Task.objects.filter(worker=worker)
            if done_status:
                qs = qs.exclude(status=done_status)
            count = qs.count()
            result[worker] = count
        return result

    class Meta:
        verbose_name = 'Команда'
        verbose_name_plural = 'Команды'


class Worker(AbstractUser):
    """Модель исполнителя."""

    team = models.ForeignKey(
        Team,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='worker',
        verbose_name='Команда',
    )
    role = models.CharField(
        max_length=100,
        verbose_name='Роль',
    )
    tech_stack = models.TextField(
        blank=False,
        help_text='Перечислите стек технологий',
        verbose_name='Стек технологий',
    )
    groups = models.ManyToManyField(
        Group,
        related_name='worker',  # уникальное имя, чтобы не конфликтовать с auth.User
        blank=True,
        help_text='Группы, к которым принадлежит пользователь.',
        verbose_name='Группы',
        related_query_name='worker',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='worker',
        blank=True,
        help_text='Разрешения, предоставленные пользователю.',
        verbose_name='Разрешения пользователя',
        related_query_name='worker',
    )
    is_published = models.BooleanField(
        default=False,
        verbose_name='Опубликовать',
    )

    def __str__(self):
        return self.get_full_name() or self.username

    class Meta:
        verbose_name = 'Работник'
        verbose_name_plural = 'Работники'

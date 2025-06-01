"""Файл регистрации моделей в админ-панели."""

from django.contrib import admin

from tasks.models import TaskStatus, WorkDirection, Task, TaskFile, SubTask


class SubTaskInline(admin.StackedInline):
    """Прикрепление подзадач к модели Task."""

    model = SubTask
    extra = 1


class TaskFileInline(admin.StackedInline):
    """Прикрепление файлов к модели Task."""

    model = TaskFile
    extra = 1


@admin.register(TaskStatus)
class TaskStatusAdmin(admin.ModelAdmin):
    """Регистрация модели TaskStatus в админ-панели."""

    list_display = ('title', 'color_tag', 'is_published')


@admin.register(WorkDirection)
class WorkDirectionAdmin(admin.ModelAdmin):
    """Регистрация модели WorkDirection в админ-панели."""

    list_display = ('title', 'team')
    list_filter = ('team',)


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """Регистрация модели Task в админ-панели."""

    list_display = ('title', 'team', 'status', 'deadline')
    list_filter = ('status', 'team', 'deadline')
    search_fields = ('title',)
    inlines = [TaskFileInline, SubTaskInline]
    readonly_fields = ('created_at',)

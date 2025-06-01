"""Файл регистрации моделей в админ-панели."""

from django.contrib import admin

from workers.models import Team, Worker


@admin.register(Team)
class TeadAdmin(admin.ModelAdmin):
    """Регистрация модели Team."""

    list_display = ('title', 'members', 'availability', 'is_published')
    readonly_fields = ('get_active_projects',)
    search_fields = ('title',)
    list_filter = ('is_published',)

    def get_active_projects(self, obj):
        return obj.active_projects
    get_active_projects.short_description = 'Активные проекты'


@admin.register(Worker)
class WorkerAdmin(admin.ModelAdmin):
    """Регистрация модели Worker."""

    list_display = ('username', 'team', 'grade', 'role')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'role')
    list_filter = ('team', 'grade', 'role')

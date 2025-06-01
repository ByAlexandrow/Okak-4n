"""Файл описания прав доступа."""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsSuperUserOrReadOnly(BasePermission):
    """Только суперпользователь может создавать, изменять и удалять объект."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authemticated
        return request.user and request.user.is_authenticated and request.user.is_superuser


class WorkDirectionPermission(BasePermission):
    """Разрешения для WorkDirection."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if user.role in ('worker', 'admin'):
            return True

        if user.role.lower() == 'manager':
            return request.method in SAFE_METHODS

        return False


class IsManagerOrSuperUserOrReadOnly(BasePermission):
    """Менеджер и суперпользователь могут создавать и удалять."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        return user.is_superuser or getattr(user, 'role', None).lower() == 'manager'


class SubTaskPermission(BasePermission):
    """Права доступа для подзадач."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return user.role in ('manager', 'worker', 'admin') or user.is_superuser

        return user.is_superuser or user.role.lower() == 'worker'

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        user = request.user
        if user.is_superuser:
            return True

        return user.role.lower() == 'worker' and user in obj.task.worker.all()


class TaskPermission(BasePermission):
    """Права доступа для задач."""

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        if user.is_superuser or user.role.lower() == 'manager':
            return True

        if user.role.lower() == 'worker':
            if request.method in SAFE_METHODS + ('PUT', 'PATCH'):
                return True
        return False

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_superuser or user.role.lower() == 'manager':
            return True

        if user.role.lower() == 'worker':
            if user in obj.worker.all():
                if request.method in SAFE_METHODS:
                    return True
                elif request.method in ('PUT', 'PATCH'):
                    return True
            return False
        return False

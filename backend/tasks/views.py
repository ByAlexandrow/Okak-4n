"""Файл функций."""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from tasks.models import TaskStatus, WorkDirection, Task, TaskFile, SubTask
from tasks.serializers import (
    TaskStatusSerializer, WorkDirectionSerializer,
    TaskFileSerializer, TaskSerializer, SubTaskSerializer
)
from tasks.permissions import (
    IsSuperUserOrReadOnly, WorkDirectionPermission,
    IsManagerOrSuperUserOrReadOnly, SubTaskPermission,
    TaskPermission
)


class TaskStatusViewSet(viewsets.ModelViewSet):
    """CRUD для статусов задач."""

    queryset = TaskStatus.objects.all()
    serializer_class = TaskStatusSerializer
    permission_classes = [IsAuthenticated, IsSuperUserOrReadOnly]


class WorkDirectionViewSet(viewsets.ModelViewSet):
    """CRUD для направлений работы с ролевым доступом."""

    queryset = WorkDirection.objects.all()
    serializer_class = WorkDirectionSerializer
    permission_classes = [IsAuthenticated, WorkDirectionPermission]


class TaskFileViewSet(viewsets.ModelViewSet):
    """CRUD для файлов, связанных с задачами."""

    queryset = TaskFile.objects.all()
    serializer_class = TaskFileSerializer
    permission_classes = [IsAuthenticated, IsManagerOrSuperUserOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        return TaskFile.objects.filter(task__worker=user)


class SubTaskViewSet(viewsets.ModelViewSet):
    """CRUD для подзадач."""

    queryset = SubTask.objects.all()
    serializer_class = SubTaskSerializer
    permission_classes = [IsAuthenticated, SubTaskPermission]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return SubTask.objects.all()

        if user.role.lower() == 'worker':
            return SubTask.objects.filter(tas__worker=user)

        if user.role.lower() == 'manager':
            return SubTask.objects.all()

        return SubTask.objects.none()


class TaskViewSet(viewsets.ModelViewSet):
    """CRUD для задач."""

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [TaskPermission]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role.lower() == 'manager':
            return Task.objects.all()
        elif user.role.lower() == 'worker':
            return Task.objects.filter(worker=user)
        else:
            return Task.objects.none()

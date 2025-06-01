"Файл-маршрутизатор для API Task."

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from tasks.views import (
    TaskStatusViewSet, WorkDirectionViewSet,
    TaskViewSet, TaskFileViewSet, SubTaskViewSet,
)
from tasks.utils import get_suitable_developer, estimate_task_details


router = DefaultRouter()
router.register(r'task-statuses', TaskStatusViewSet)
router.register(r'task-directions', WorkDirectionViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'task-files', TaskFileViewSet)
router.register(r'subtasks', SubTaskViewSet)

urlpatterns = [
    path('person/', get_suitable_developer, name='person'),
    path('complexity/', estimate_task_details, name='complexity'),
    path('', include(router.urls)),
]

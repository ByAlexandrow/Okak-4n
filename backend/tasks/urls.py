"Файл-маршрутизатор для API Task."

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from tasks.views import (
    TaskStatusViewSet, WorkDirectionViewSet,
    TaskViewSet, TaskFileViewSet, SubTaskViewSet
)


router = DefaultRouter()
router.register(r'task-statuses', TaskStatusViewSet)
router.register(r'task-directions', WorkDirectionViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'task-files', TaskFileViewSet)
router.register(r'subtasks', SubTaskViewSet)

urlpatterns = [
    # path('analyze/'),
    # path('submit/'),
    path('', include(router.urls))
]

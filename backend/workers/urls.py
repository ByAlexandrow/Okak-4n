"""Файл-маршрутизатор для приложения workers."""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from workers.views import TeamViewSet, WorkerViewSet


router = DefaultRouter()
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'worker', WorkerViewSet, basename='worker')

urlpatterns = [
    path('', include(router.urls)),
]

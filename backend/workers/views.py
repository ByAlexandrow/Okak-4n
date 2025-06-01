"""Файл функций."""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from workers.models import Team, Worker
from workers.serializers import TeamSerializer, WorkerSerializer


class TeamViewSet(viewsets.ModelViewSet):
    """CRUD для команд."""

    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]


class WorkerViewSet(viewsets.ModelViewSet):
    """CRUD для работников."""

    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    permission_classes = [IsAuthenticated]

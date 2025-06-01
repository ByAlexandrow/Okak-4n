""""Файл валидации получаемых данных через API."""

from rest_framework import serializers

from workers.models import Team, Worker


class WorkerSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Worker."""

    user_full_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True,
    )
    team_title = serializers.CharField(
        source='team.title',
        read_only=True,
    )

    class Meta:
        model = Worker
        fields = ['id', 'role', 'tech_stach', 'user', 'user_full_name', 'team', 'team_title']
        read_only_fields = ['user_full_name', 'team_title']


class TeamSerializer(serializers.ModelSerializer):
    """Сериализатор для модели Team."""

    active_projects = serializers.ReadOnlyField()
    active_projects_per_member = serializers.SerializerMethodField()
    workers = WorkerSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = [
            'id', 'title', 'description', 'members',
            'active_projects', 'active_projects_per_member',
            'is_published'
        ]

    def get_active_projects_per_member(self, obj):
        result = obj.active_projects_per_member()
        return {str(worker): count for worker, count in result.items()}

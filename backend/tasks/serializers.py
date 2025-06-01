"Файл валидации получаемых данных через API."

from rest_framework import serializers
from django.utils import timezone

from tasks.models import TaskStatus, WorkDirection, Task, TaskFile, SubTask


class TaskStatusSerializer(serializers.ModelSerializer):
    """Сериализатор для модели TaskStatus."""

    class Meta:
        model = TaskStatus
        fields = ['id', 'title', 'color_tag', 'is_published']


class WorkDirectionSerializer(serializers.ModelSerializer):
    """Сериализатор для модели WorkDirection."""

    class Meta:
        model = WorkDirection
        fields = ['id', 'title', 'tech_stach', 'is_published']


class TaskFileSerializer(serializers.ModelSerializer):
    """Сериализатор для модели TaskFile."""

    class Meta:
        model = TaskFile
        fields = ['id', 'file', 'uploaded_at', 'task']
        read_only_fields = ['uploaded_at']

    def validate_file(self, value):
        """Функция проверки размера загружаемого файла."""

        max_size_mb = 5
        if value.size > max_size_mb * 1024 * 1024:
            raise serializers.ValidationError(
                f'Максимальный размер файла {max_size_mb} МБ.'
            )
        return value


class SubTaskSerializer(serializers.ModelSerializer):
    """Сериализатор для модели SubTask."""

    class Meta:
        model = SubTask
        fields = ['id', 'title', 'description', 'is_completed', 'created_at', 'task']
        read_only_fields = ['created_at']

    def validate(self, data):
        """Функция проверки количества создаваемых подзадач."""

        task = data.get('task') or self.instance.task
        if not self.instance:
            if task.subtasks.count() >= 8:
                raise serializers.ValidationError(
                    'Нельзя добавить больше 8 подзадач!'
                )
        return data


class TaskSerializer(serializers.ModelSerializer):
    """Сериализатор для модели WorkDirection."""

    direction_id = serializers.PrimaryKeyRelatedField(
        queryset=WorkDirection.objects.all(), source='direction', write_only=True
    )
    status_id = serializers.PrimaryKeyRelatedField(
        queryset=TaskStatus.objects.all(), source='status', write_only=True, allow_null=True, required=False
    )
    direction = serializers.StringRelatedField(read_only=True)
    status = serializers.StringRelatedField(read_only=True)
    # files и subtasks можно добавить, если нужно

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'direction', 'direction_id',
            'deadline', 'status', 'status_id', 'price', 'complexity',
            'link', 'created_at', 'files', 'subtasks',
            # 'team', 'team_id', 'worker', 'worker_ids'
        ]
        read_only_fields = ['created_at']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        user = self.context['request'].user if 'request' in self.context else None
        instance = getattr(self, 'instance', None)

        if user and user.role == 'worker':
            if instance and user in instance.worker.all():
                for field_name in self.fields:
                    if field_name != 'status' and field_name not in ['status_id']:
                        self.fields[field_name].read_only = True
            else:
                for field in self.fields.values():
                    field.read_only = True

    def validate_deadline(self, value):
        if value < timezone.localdate():
            raise serializers.ValidationError('Дедлайн не может быть в прошлом!')
        return value

    def validate(self, data):
        user = self.context['request'].user
        instance = getattr(self, 'instance', None)

        if user.role == 'worker' and instance and user in instance.worker.all():
            # Разрешаем изменять только поле 'status' и 'status_id'
            allowed_fields = {'status', 'status_id'}
            changed_fields = set(data.keys())
            if not changed_fields.issubset(allowed_fields):
                raise serializers.ValidationError("Вы можете изменять только поле 'status'.")
        return data

    def create(self, validated_data):
        direction = validated_data.pop('direction')
        status = validated_data.pop('status', None)
        # team = validated_data.pop('team', None)
        # workers = validated_data.pop('worker', None)

        task = Task.objects.create(direction=direction, status=status, **validated_data)  # team=team

        # if workers is not None:
        #     task.worker.set(workers)

        return task

    def update(self, instance, validated_data):
        direction = validated_data.pop('direction', None)
        status = validated_data.pop('status', None)
        # team = validated_data.pop('team', None)
        # workers = validated_data.pop('worker', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if direction is not None:
            instance.direction = direction
        if status is not None:
            instance.status = status
        # if team is not None:
        #     instance.team = team

        instance.save()

        # if workers is not None:
        #     instance.worker.set(workers)

        return instance

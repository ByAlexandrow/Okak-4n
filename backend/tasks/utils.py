"""Файл вспомогательных функций для валидации расширений файлов."""

import os
from django.core.exceptions import ValidationError


def upload_to_path(instance, filename):
    """Функция загрузки файла в определенную папку в зависимости от формата файла."""

    ext = filename.split('.')[-1].lower()
    image_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp']

    if ext in image_extensions:
        subdir = 'task_images'
    else:
        subdir = 'task_files'

    return os.path.join(subdir, filename)


def validate_file_extension(value):
    """Функция проверки сраширения файла."""

    ext = os.path.splitext(value.name)[1].lower()
    valid_image_ext = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp']
    valid_file_ext = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.zip', '.rar']

    if ext not in valid_image_ext + valid_file_ext:
        raise ValidationError('Неподдерживаемый формат файла.')

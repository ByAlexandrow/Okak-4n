from django.db import models

class Project(models.Model):
    STATUS_CHOICES = [
        ('new', 'Новая'),
        ('in-progress', 'В работе'),
        ('review', 'На проверке'),
        ('completed', 'Завершена'),
    ]
    
    COMPLEXITY_CHOICES = [
        ('low', 'Низкая'),
        ('medium', 'Средняя'),
        ('high', 'Высокая'),
        ('critical', 'Критическая'),
    ]
    
    PROJECT_TYPE_CHOICES = [
        ('web', 'Веб-приложение'),
        ('mobile', 'Мобильное приложение'),
        ('desktop', 'Десктопное приложение'),
        ('landing', 'Лендинг страница'),
        ('ecommerce', 'Интернет-магазин'),
        ('crm', 'CRM система'),
        ('ai', 'AI/ML решение'),
        ('blockchain', 'Blockchain проект'),
        ('other', 'Другое'),
    ]
    
    project_name = models.CharField(max_length=255, verbose_name='Название проекта')
    description = models.TextField(verbose_name='Описание проекта')
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES, verbose_name='Тип проекта')
    budget = models.CharField(max_length=50, blank=True, null=True, verbose_name='Бюджет')
    timeline = models.CharField(max_length=50, blank=True, null=True, verbose_name='Сроки')
    team = models.CharField(max_length=255, blank=True, null=True, verbose_name='Команда')
    contact_email = models.EmailField(verbose_name='Email для связи')
    contact_phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='Телефон')
    additional_info = models.TextField(blank=True, null=True, verbose_name='Дополнительная информация')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name='Статус')
    complexity = models.CharField(max_length=20, choices=COMPLEXITY_CHOICES, default='medium', verbose_name='Сложность')
    estimated_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Оценочная стоимость')
    assigned_team = models.CharField(max_length=255, blank=True, null=True, verbose_name='Назначенная команда')
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    analysis_data = models.JSONField(blank=True, null=True, verbose_name='Данные анализа')
    
    class Meta:
        verbose_name = 'Проект'
        verbose_name_plural = 'Проекты'
        ordering = ['-timestamp']
    
    def __str__(self):
        return self.project_name

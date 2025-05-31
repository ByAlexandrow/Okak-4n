from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name='Название команды')
    type = models.CharField(max_length=100, verbose_name='Тип команды')
    members = models.IntegerField(default=0, verbose_name='Количество участников')
    active_projects = models.IntegerField(default=0, verbose_name='Активные проекты')
    skills = models.JSONField(default=list, verbose_name='Навыки')
    availability = models.IntegerField(default=100, verbose_name='Доступность (%)')
    
    class Meta:
        verbose_name = 'Команда'
        verbose_name_plural = 'Команды'
        ordering = ['name']
    
    def __str__(self):
        return self.name

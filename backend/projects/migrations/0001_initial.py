# Generated by Django 4.2.7 on 2025-05-31 13:16

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project_name', models.CharField(max_length=255, verbose_name='Название проекта')),
                ('description', models.TextField(verbose_name='Описание проекта')),
                ('project_type', models.CharField(choices=[('web', 'Веб-приложение'), ('mobile', 'Мобильное приложение'), ('desktop', 'Десктопное приложение'), ('landing', 'Лендинг страница'), ('ecommerce', 'Интернет-магазин'), ('crm', 'CRM система'), ('ai', 'AI/ML решение'), ('blockchain', 'Blockchain проект'), ('other', 'Другое')], max_length=20, verbose_name='Тип проекта')),
                ('budget', models.CharField(blank=True, max_length=50, null=True, verbose_name='Бюджет')),
                ('timeline', models.CharField(blank=True, max_length=50, null=True, verbose_name='Сроки')),
                ('team', models.CharField(blank=True, max_length=255, null=True, verbose_name='Команда')),
                ('contact_email', models.EmailField(max_length=254, verbose_name='Email для связи')),
                ('contact_phone', models.CharField(blank=True, max_length=20, null=True, verbose_name='Телефон')),
                ('additional_info', models.TextField(blank=True, null=True, verbose_name='Дополнительная информация')),
                ('status', models.CharField(choices=[('new', 'Новая'), ('in-progress', 'В работе'), ('review', 'На проверке'), ('completed', 'Завершена')], default='new', max_length=20, verbose_name='Статус')),
                ('complexity', models.CharField(choices=[('low', 'Низкая'), ('medium', 'Средняя'), ('high', 'Высокая'), ('critical', 'Критическая')], default='medium', max_length=20, verbose_name='Сложность')),
                ('estimated_cost', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Оценочная стоимость')),
                ('assigned_team', models.CharField(blank=True, max_length=255, null=True, verbose_name='Назначенная команда')),
                ('timestamp', models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')),
                ('analysis_data', models.JSONField(blank=True, null=True, verbose_name='Данные анализа')),
            ],
            options={
                'verbose_name': 'Проект',
                'verbose_name_plural': 'Проекты',
                'ordering': ['-timestamp'],
            },
        ),
    ]

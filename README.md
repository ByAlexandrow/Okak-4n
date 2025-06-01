# Okak-4n Backend (Django)

[![Build Status](https://github.com/ByAlexandrow/Okak-4n/actions/workflows/django.yml/badge.svg?branch=backend)](https://github.com/ByAlexandrow/Okak-4n/actions/workflows/django.yml)
[![Python Version](https://img.shields.io/badge/python-3.10%2B-blue)](https://www.python.org/)
[![Django Version](https://img.shields.io/badge/django-4.2-brightgreen)](https://www.djangoproject.com/)

Backend часть приложения Okak-4n, реализованная на Django и Django REST Framework. Предоставляет REST API для управления задачами с JWT-аутентификацией и автоматической документацией.

## Технологический стек
- **Python 3.10+**
- **Django 4.2**
- **Django REST Framework** - для построения REST API
- **PostgreSQL** - основная база данных
- **JWT аутентификация** - безопасный доступ к API
- **drf-yasg** - автоматическая генерация Swagger/OpenAPI документации
- **Simple JWT** - реализация JWT токенов
- **python-dotenv** - управление переменными окружения
- **Gunicorn** - production-ready сервер (для развертывания)
- **GitHub Actions** - CI/CD конвейер

## Функциональность API
- ✅ Регистрация и авторизация пользователей
- ✅ Управление задачами (CRUD операции)
- ✅ Фильтрация и сортировка задач
- ✅ JWT аутентификация
- ✅ Автоматическая документация API
- ✅ Валидация данных
- ✅ Пагинация результатов
- ✅ Система разрешений (доступ только к своим задачам)

## Быстрый старт

### Предварительные требования
- Python 3.10+
- PostgreSQL 14+
- Git

### Установка и настройка
1. Клонируйте репозиторий и перейдите в папку backend:
```bash
git clone -b backend https://github.com/ByAlexandrow/Okak-4n.git
cd Okak-4n/backend
```

2. Создайте и активируйте виртуальное окружение:
```bash
python -m venv venv
# Linux/MacOS
source venv/bin/activate
# Windows
venv\Scripts\activate
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Создайте файл окружения (на основе примера):
```bash
cp .env.example .env
```

5. Отредактируйте `.env` файл, указав свои настройки:
```env
SECRET_KEY=ваш_уникальный_секретный_ключ
DEBUG=True
DB_NAME=okak4n
DB_USER=postgres
DB_PASSWORD=ваш_пароль
DB_HOST=localhost
DB_PORT=5432
```

6. Примените миграции:
```bash
python manage.py migrate
```

7. Создайте суперпользователя (опционально):
```bash
python manage.py createsuperuser
```

### Запуск сервера для разработки
```bash
python manage.py runserver
```

Сервер будет доступен по адресу: http://localhost:8000

## Документация API
После запуска сервера доступны два варианта документации:

1. **Swagger UI** (интерактивный):  
   http://localhost:8000/swagger/

2. **ReDoc** (альтернативный формат):  
   http://localhost:8000/redoc/

Документация генерируется автоматически на основе кода и включает:
- Описание всех эндпоинтов
- Параметры запросов
- Примеры запросов и ответов
- Возможность тестирования API прямо в браузере

## Основные эндпоинты API

### Аутентификация
| Метод | Эндпоинт       | Описание                |
|-------|----------------|-------------------------|
| POST  | /api/auth/register | Регистрация пользователя |
| POST  | /api/auth/login    | Авторизация, получение токена |
| POST  | /api/auth/refresh  | Обновление JWT токена |

### Задачи
| Метод | Эндпоинт       | Описание                |
|-------|----------------|-------------------------|
| GET   | /api/tasks     | Получить список задач (с фильтрацией) |
| POST  | /api/tasks     | Создать новую задачу    |
| GET   | /api/tasks/{id}| Получить задачу по ID   |
| PUT   | /api/tasks/{id}| Обновить задачу         |
| DELETE| /api/tasks/{id}| Удалить задачу          |

## Примеры запросов

### Регистрация пользователя
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "strongpassword123"
  }'
```

### Авторизация
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "password": "strongpassword123"
  }'
```

### Создание задачи (требуется авторизация)
```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Authorization: Bearer ваш_jwt_токен" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Важная задача",
    "description": "Описание важной задачи",
    "status": "new"
  }'
```

## Тестирование
Для запуска тестов выполните:
```bash
python manage.py test
```

Тесты покрывают:
- Регистрацию и авторизацию пользователей
- CRUD операции с задачами
- Проверку прав доступа
- Валидацию данных

## Настройка CI/CD
Проект включает GitHub Actions для автоматического тестирования. Конфигурация находится в `.github/workflows/django.yml`

### Основные шаги CI:
1. Установка Python 3.10
2. Настройка PostgreSQL
3. Установка зависимостей
4. Запуск миграций
5. Выполнение тестов

## Структура проекта
```
backend/
├── .env.example            - Пример файла окружения
├── .gitignore
├── manage.py               - Скрипт управления Django
├── requirements.txt        - Зависимости
├── README.md               - Этот файл
│
├── api/                    - Основное приложение
│   ├── migrations/         - Миграции базы данных
│   ├── tests/              - Тесты
│   │   ├── test_auth.py    - Тесты аутентификации
│   │   └── test_tasks.py   - Тесты задач
│   │
│   ├── __init__.py
│   ├── admin.py            - Админ-панель
│   ├── apps.py
│   ├── models.py           - Модели данных
│   ├── serializers.py      - Сериализаторы
│   ├── urls.py             - URL-роуты
│   └── views.py            - Обработчики запросов
│
└── okak4n/                - Конфигурация проекта
    ├── __init__.py
    ├── asgi.py
    ├── settings.py         - Основные настройки
    ├── urls.py             - Глобальные URL-роуты
    └── wsgi.py
```

## Миграции базы данных
При изменении моделей создавайте новые миграции:
```bash
python manage.py makemigrations
```

Примените миграции к базе данных:
```bash
python manage.py migrate
```

## Развертывание в production
Для production развертывания рекомендуется:
1. Установить DEBUG=False в .env
2. Использовать production-сервер (Gunicorn + Nginx)
3. Настроить HTTPS
4. Использовать переменные окружения для секретов
5. Настроить брандмауэр и ограничить доступ к портам
6. Регулярно обновлять зависимости

Пример команды для запуска через Gunicorn:
```bash
gunicorn okak4n.wsgi:application --workers 4 --bind 0.0.0.0:8000
```

## Лицензия
Проект распространяется под лицензией MIT. Подробнее см. в файле LICENSE.

---

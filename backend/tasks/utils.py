"""Файл вспомогательных функций."""

import os
import json
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view
from openai import OpenAI
from dotenv import load_dotenv

from workers.models import Worker


@api_view(['POST'])
def estimate_task_details(task_name: str, task_description: str, task_direction: str) -> dict | None:
    """ Определяет сложность, примерное время выполнения и стоимость задачи с помощью LLM.

    Args:
        task_name (str): Название задачи.
        task_description (str): Подробное описание задачи.
        task_direction (str): Направление разработки задачи (e.g., 'Backend', 'Frontend').

    Returns:
        dict | None: Словарь с 'complexity', 'estimated_time_value',
                     'estimated_time_unit', 'estimated_cost', 'justification'
                     или None в случае ошибки.
    """
    load_dotenv()

    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )

    DEEPSEEK_MODEL = "deepseek/deepseek-r1-0528:free"

    DAILY_RATE = 12000.0
    HOURLY_RATE = DAILY_RATE / 8

    messages = [
        {"role": "system", "content": """Ты - эксперт по оценке задач в программной разработке. Твоя задача - проанализировать предоставленную задачу и определить её:
        1.  **Сложность** по шкале от 1 до 5 (1 - очень легко, 5 - очень сложно).
        2.  **Примерное время выполнения** (в часах или днях).

        Учитывай общие стандарты разработки, возможные зависимости, объем работы, а также название, описание и направление задачи.

        **Твой ответ должен быть СТРОГО в формате JSON.** Не включай никаких дополнительных слов или объяснений вне JSON.

        Пример ожидаемого JSON-формата:
        ```json
        {
          "complexity": 3,
          "estimated_time_value": 5,
          "estimated_time_unit": "days",
          "estimation_justification": "Эта задача включает реализацию X и Y, что потребует около 5 дней, учитывая необходимость настройки Z и тестирования."
        }
        ```
        Используй "days" для длительности более 8 часов, иначе "hours".
        """},
        {"role": "user", "content": f"""
        **Оцени следующую задачу:**
          Название: {task_name}
          Описание: {task_description}
          Направление: {task_direction}
        """}
    ]

    try:
        print(f"Отправка запроса к модели {DEEPSEEK_MODEL} для оценки задачи '{task_name}'...")

        chat_completion = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=messages,
            temperature=0.1,
            response_format={"type": "json_object"},
        )

        response_content = chat_completion.choices[0].message.content.strip()

        if response_content.startswith("```json") and response_content.endswith("```"):
            json_string_to_parse = response_content[len("```json"): -len("```")].strip()
        else:
            json_string_to_parse = response_content

        try:
            parsed_response = json.loads(json_string_to_parse)
        except json.JSONDecodeError as e:
            print(f"Ошибка парсинга JSON ответа модели: {e}")
            print(f"Некорректный JSON: {response_content}")
            return None

        complexity = parsed_response.get("complexity")
        estimated_time_value = parsed_response.get("estimated_time_value")
        estimated_time_unit = parsed_response.get("estimated_time_unit")
        justification = parsed_response.get("estimation_justification")

        if not all([isinstance(complexity, int), 1 <= complexity <= 5,
                    isinstance(estimated_time_value, (int, float)),
                    isinstance(estimated_time_unit, str) and estimated_time_unit in ["hours", "days"]]):
            print("Предупреждение: Ответ модели содержит некорректные или отсутствующие данные оценки.")
            return None

        estimated_cost = 0.0
        if estimated_time_unit == "days":
            estimated_cost = estimated_time_value * DAILY_RATE
        elif estimated_time_unit == "hours":
            estimated_cost = estimated_time_value * HOURLY_RATE

        return {
            "complexity": complexity,
            "estimated_time_value": estimated_time_value,
            "estimated_time_unit": estimated_time_unit,
            "estimated_cost": round(estimated_cost, 2),
            "justification": justification
        }

    except Exception as e:
        print(f"Ошибка при обращении к OpenRouter/DeepSeek: {e}")
        return None


def load_developer_profiles(filename="developers_profiles+.json"):
    """Загружает профили разработчиков из JSON-файла."""

    workers_qs = Worker.objects.all()

    developers_data = []
    for worker_obj in workers_qs:
        developers_data.append(worker_obj.to_llm_dict())

    return developers_data


def format_developer_profile_for_prompt(developer):
    """Форматирует профиль разработчика для включения в промпт нейросети."""

    skills_str = ", ".join([f"{skill} ({level})" for skill, level in developer['skills'].items()])

    tasks_str = "No current tasks."

    if developer['current_tasks']:
        tasks_details = [
            f"- '{task['name']}' (complexity {task['complexity']}, deadline {task['deadline']})"
            for task in developer['current_tasks']
        ]
        tasks_str = "\\n  " + "\\n  ".join(tasks_details)

    return (
        f"---\\n"
        f"**Разработчик ID: {developer['id']}**\\n"
        f"  Имя: {developer['name']}\\n"
        f"  Направление: {developer['direction']}\\n"
        f"  Уровень: {developer['seniority_level']} ({developer['experience_years']} лет опыта)\\n"
        f"  Навыки: {skills_str}\\n"
        f"  Текущие задачи: {tasks_str}\\n"
    )


@api_view(['GET'])
def get_suitable_developer(task_name: str, task_description: str, task_direction: str, task_complexity: int,
                           task_deadline: str) -> str | None:
    """
    Identifies the most suitable developer for a new task using an LLM.

    Args:
        task_name (str): The name of the new task.
        task_description (str): A detailed description of the new task.
        task_direction (str): The primary development direction for the task (e.g., 'Backend', 'Frontend').
        task_complexity (int): The complexity of the task (1-5), pre-calculated by an LLM.
        task_deadline (str): The deadline for the task (YYYY-MM-DD format).

    Returns:
        str | None: The name of the most suitable developer, or None if no developer is found or an error occurs.
    """

    load_dotenv()

    API_KEY = os.getenv("OPENROUTER_API_KEY", '')
    if not API_KEY:
        raise ValueError("API ключ не найден. Убедитесь, что он установлен в файле .env")

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=API_KEY,
    )

    DEEPSEEK_MODEL = "deepseek/deepseek-r1-0528:free"

    all_developers = load_developer_profiles()
    if not all_developers:
        return None

    filtered_developers = [
        dev for dev in all_developers
        if dev['direction'] == task_direction or
           (task_direction == "Fullstack" and dev['direction'] in ["Frontend", "Backend"]) or
           (dev['direction'] == "Fullstack" and task_direction in ["Frontend", "Backend"])
    ]

    if not filtered_developers:
        print(f"No developers found for direction '{task_direction}'.")
        return None

    print(f"Скормлено {len(filtered_developers)} разрабов")
    developers_prompt_parts = "\\n".join([
        format_developer_profile_for_prompt(dev) for dev in filtered_developers
    ])

    messages = [
        {"role": "system", "content": """You are an intelligent task allocation system for an agile development team. Your goal is to analyze a new task and available developer profiles to select the MOST suitable one.

        Consider:
        - Developer's skills match the task requirements.
        - Developer's experience level versus task complexity.
        - New task's deadline and developer's current task deadlines (avoiding overload).
        The emphasis should be on people's workload. (It is better to give the task to a less suitable person, but more free)

        **Your response must ONLY contain:**
        - The name of the selected developer.
        - A brief, comprehensive justification for your choice (1-3 sentences).

        Response format:
        Selected Developer Name: [Name]
        Justification: [Reason for selection]
        """},
        {"role": "user", "content": f"""
        **New Task Details:**
          Name: {task_name}
          Description: {task_description}
          Direction: {task_direction}
          Complexity (1-5): {task_complexity}
          Deadline: {task_deadline}

        **Available Developers:**
        {developers_prompt_parts}

        ---
        **Please choose the most suitable developer from the list above, based on the task and their profiles.**
        """}
    ]

    try:

        print(f"Sending request to {DEEPSEEK_MODEL} for task '{task_name}'...")
        chat_completion = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=messages,
            temperature=0.2,
        )

        response_content = chat_completion.choices[0].message.content.strip()

        developer_name = None
        lines = response_content.splitlines()

        for line in lines:
            stripped_line = line.strip()
            if stripped_line.startswith("Selected Developer Name:"):
                developer_name = stripped_line.removeprefix("Selected Developer Name:").strip()
                break

        return developer_name

    except Exception as e:
        print(f"Error calling OpenRouter/DeepSeek: {e}")
        return None


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


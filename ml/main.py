import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY", '')
if not API_KEY:
    raise ValueError("API ключ не найден. Убедитесь, что он установлен в файле .env")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

DEEPSEEK_MODEL = "deepseek/deepseek-r1-0528:free"

# --- 2. Загрузка профилей разработчиков ---

def load_developer_profiles(filename="developers_profiles.json"):
    """Загружает профили разработчиков из JSON-файла."""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            profiles = json.load(f)
        print(f"Загружено {len(profiles)} профилей разработчиков из '{filename}'.")
        return profiles
    except FileNotFoundError:
        print(f"Ошибка: Файл '{filename}' не найден. Убедитесь, что он создан скриптом генерации.")
        return []
    except json.JSONDecodeError:
        print(f"Ошибка: Некорректный формат JSON в файле '{filename}'.")
        return []

# --- 3. Функция для форматирования профиля разработчика для промпта ---

def format_developer_profile_for_prompt(developer):
    """Форматирует профиль разработчика для включения в промпт нейросети."""
    skills_str = ", ".join([f"{skill} ({level})" for skill, level in developer['skills'].items()])
    tasks_str = "Нет текущих задач."
    if developer['current_tasks']:
        tasks_details = [
            f"- '{task['name']}' ({task['complexity']} сложность, дедлайн {task['deadline']})"
            for task in developer['current_tasks']
        ]
        tasks_str = "\\n  " + "\\n  ".join(tasks_details)

    vacation_str = "Нет запланированных отпусков."
    if developer['vacation_schedule']:
        vacation_str = (f"Запланирован отпуск с {developer['vacation_schedule']['start_date']} "
                        f"по {developer['vacation_schedule']['end_date']}.")

    preferences_str = ", ".join(developer['preferences']) if developer['preferences'] else "Нет особых предпочтений."

    return (
        f"---\\n"
        f"**Разработчик ID: {developer['id']}**\\n"
        f"  Имя: {developer['name']}\\n"
        f"  Направление: {developer['direction']}\\n"
        f"  Уровень: {developer['seniority_level']} ({developer['experience_years']} лет опыта)\\n"
        f"  Навыки: {skills_str}\\n"
        f"  Текущая загруженность (процент): {developer['current_load_percent']}%\\n"
        f"  Еженедельная доступность (часов): {developer['weekly_capacity_hours']}\\n"
        f"  Текущие задачи: {tasks_str}\\n"
        f"  Предпочтения: {preferences_str}\\n"
        f"  Отпуск: {vacation_str}"
    )



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
    all_developers = load_developer_profiles()
    if not all_developers:
        return None

    # Filter developers by direction
    # This reduces the amount of data sent to the LLM and focuses its attention.
    # Fullstack tasks can be assigned to Frontend/Backend, and vice-versa.
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
        - Developer's current workload (lower percentage is better).
        - Developer's weekly availability.
        - Developer's preferences (if they align with the task).
        - Planned vacations (tasks should not be assigned during vacation).
        - New task's deadline and developer's current task deadlines (avoiding overload).

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
            temperature=0.2,  # Low temperature for more deterministic and logical choices
            #max_tokens=200,  # Enough tokens for the name and justification
        )

        response_content = chat_completion.choices[0].message.content.strip()

        # --- DEBUGGING BLOCK ---
        # Use repr() to see exact characters like \n for precise debugging
        # print("\n--- RAW MODEL RESPONSE (for parsing debug) ---")
        # print(repr(response_content))
        # print("----------------------------------------------\n")
        # --- END DEBUGGING BLOCK ---

        developer_name = None
        # Use .splitlines() to correctly handle various newline types
        lines = response_content.splitlines()

        # Extract developer name from the response
        for line in lines:
            stripped_line = line.strip()
            if stripped_line.startswith("Selected Developer Name:"):
                developer_name = stripped_line.removeprefix("Selected Developer Name:").strip()
                break  # Found the name, no need to continue parsing for it

        return developer_name

    except Exception as e:
        print(f"Error calling OpenRouter/DeepSeek: {e}")
        return None


if __name__ == "__main__":
    # Шаг 1: Загружаем профили разработчиков
    all_devs = load_developer_profiles()
    if not all_devs:
        exit() # Выходим, если профили не загружены

    # Шаг 2: Определяем новую задачу (сложность 1-5 уже должна быть вычислена)
    # new_task_1 = {
    #     "name": "Реализовать систему регистрации и аутентификации пользователей",
    #     "description": "Разработать REST API для регистрации, входа, выхода и обновления профиля пользователей с использованием JWT-токенов. Требуется валидация ввода и обработка ошибок. База данных PostgreSQL.",
    #     "direction": "Backend",
    #     "complexity": 4, # Предполагаем, что вы это уже вычислили
    #     "deadline": "2025-06-20" # Пример дедлайна
    # }
    #
    #
    # new_task_2 = {
    #     "name": "Обновить UI главной страницы",
    #     "description": "Переделать дизайн главной страницы в соответствии с новыми макетами Figma. Включает адаптивную верстку для мобильных и десктопных устройств. Используется React и Tailwind CSS.",
    #     "direction": "Frontend",
    #     "complexity": 3,
    #     "deadline": "2025-06-15"
    # }
    #
    # new_task_3 = {
    #     "name": "Настроить автоматический деплой для нового сервиса",
    #     "description": "Разработать CI/CD пайплайн для нового микросервиса на Node.js. Использовать Jenkins для автоматического тестирования и деплоя в Kubernetes на AWS.",
    #     "direction": "DevOps",
    #     "complexity": 5,
    #     "deadline": "2025-07-01"
    # }

    task_1_name = "Implement User Authentication API"
    task_1_description = "Develop a REST API for user registration, login, logout, and profile updates using JWT. Requires input validation and error handling. PostgreSQL database."
    task_1_direction = "Backend"
    task_1_complexity = 4  # Assume this came from your complexity calculation
    task_1_deadline = "2025-06-20"

    # Шаг 3: Распределяем задачу
    print("\\n--- Распределение Задачи 1 ---")
    selected_dev_1 = get_suitable_developer(
        task_1_name, task_1_description, task_1_direction, task_1_complexity, task_1_deadline)
    if selected_dev_1:
        print(f"Task '{task_1_name}' assigned to: {selected_dev_1}")
    else:
        print(f"Failed to assign task '{task_1_name}'.")

    exit()

    # Example Task 2: Frontend UI overhaul
    task_2_name = "Revamp Homepage UI"
    task_2_description = "Redesign the main page according to new Figma mockups. Includes responsive layout for mobile and desktop. Uses React and Tailwind CSS."
    task_2_direction = "Frontend"
    task_2_complexity = 3
    task_2_deadline = "2025-06-15"

    print("\\n--- Allocating Task 2 ---")
    selected_dev_2 = get_suitable_developer(
        task_2_name, task_2_description, task_2_direction, task_2_complexity, task_2_deadline
    )
    if selected_dev_2:
        print(f"Task '{task_2_name}' assigned to: {selected_dev_2}")
    else:
        print(f"Failed to assign task '{task_2_name}'.")

    # Example Task 3: DevOps CI/CD setup
    task_3_name = "Setup CI/CD for New Microservice"
    task_3_description = "Configure a CI/CD pipeline for a new Node.js microservice. Use Jenkins for automated testing and deployment to Kubernetes on AWS."
    task_3_direction = "DevOps"
    task_3_complexity = 5
    task_3_deadline = "2025-07-01"

    print("\\n--- Allocating Task 3 ---")
    selected_dev_3 = get_suitable_developer(
        task_3_name, task_3_description, task_3_direction, task_3_complexity, task_3_deadline
    )
    if selected_dev_3:
        print(f"Task '{task_3_name}' assigned to: {selected_dev_3}")
    else:
        print(f"Failed to assign task '{task_3_name}'.")
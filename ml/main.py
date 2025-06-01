import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, render_template
from openai import OpenAI
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY", '')
if not API_KEY:
    raise ValueError("API ключ не найден. Убедитесь, что он установлен в файле .env")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=API_KEY,
)

DEEPSEEK_MODEL = "deepseek/deepseek-r1-0528:free"

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

def format_developer_profile_for_prompt(developer):
    """Форматирует профиль разработчика для включения в промпт нейросети."""
    skills_str = ", ".join([f"{skill} ({level})" for skill, level in developer['skills'].items()])
    tasks_str = "Нет текущих задач."
    if developer['current_tasks']:
        tasks_details = [
            f"- '{task['name']}' ({task['complexity']} сложность, дедлайн {task['deadline']})"
            for task in developer['current_tasks']
        ]
        tasks_str = "\n  " + "\n  ".join(tasks_details)

    vacation_str = "Нет запланированных отпусков."
    if developer['vacation_schedule']:
        vacation_str = (f"Запланирован отпуск с {developer['vacation_schedule']['start_date']} "
                        f"по {developer['vacation_schedule']['end_date']}.")

    preferences_str = ", ".join(developer['preferences']) if developer['preferences'] else "Нет особых предпочтений."

    return (
        f"---\n"
        f"**Разработчик ID: {developer['id']}**\n"
        f"  Имя: {developer['name']}\n"
        f"  Направление: {developer['direction']}\n"
        f"  Уровень: {developer['seniority_level']} ({developer['experience_years']} лет опыта)\n"
        f"  Навыки: {skills_str}\n"
        f"  Текущая загруженность (процент): {developer['current_load_percent']}%\n"
        f"  Еженедельная доступность (часов): {developer['weekly_capacity_hours']}\n"
        f"  Текущие задачи: {tasks_str}\n"
        f"  Предпочтения: {preferences_str}\n"
        f"  Отпуск: {vacation_str}"
    )

def get_suitable_developer(task_name: str, task_description: str, task_direction: str, task_complexity: int,
                           task_deadline: str) -> str | None:
    """
    Identifies the most suitable developer for a new task using an LLM.
    """
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

    developers_prompt_parts = "\n".join([
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
            temperature=0.2,
        )

        response_content = chat_completion.choices[0].message.content.strip()
        lines = response_content.splitlines()

        for line in lines:
            stripped_line = line.strip()
            if stripped_line.startswith("Selected Developer Name:"):
                developer_name = stripped_line.removeprefix("Selected Developer Name:").strip()
                return developer_name

        return None

    except Exception as e:
        print(f"Error calling OpenRouter/DeepSeek: {e}")
        return None

@app.route('/', methods=['GET'])
def index():
    return render_template('admin.html')

@app.route('/analyze', methods=['POST'])
def analyze_project():
    data = request.json
    description = data.get('description', '')
    team = data.get('team', '')
    start_date = data.get('start_date')
    end_date = data.get('end_date')

    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')
    duration_days = (end - start).days
    is_urgent = duration_days < 14

    assigned_team = "Fullstack"
    if "mobile" in team.lower(): assigned_team = "Mobile"
    elif "front" in team.lower(): assigned_team = "Frontend"
    elif "back" in team.lower(): assigned_team = "Backend"
    elif "qa" in team.lower(): assigned_team = "QA"
    elif "devops" in team.lower(): assigned_team = "DevOps"

    complexity = "medium"
    if len(description) > 500: complexity = "high"
    if "сложн" in description or "срочн" in description: complexity = "critical"

    complexity_score = 3
    if complexity == "high": complexity_score = 4
    elif complexity == "critical": complexity_score = 5

    base_cost = 15000 * duration_days
    if complexity == "high": base_cost *= 1.5
    elif complexity == "critical": base_cost *= 2.0
    if is_urgent: base_cost *= 1.3

    selected_developer = get_suitable_developer(
        task_name="Project Task",
        task_description=description,
        task_direction=assigned_team,
        task_complexity=complexity_score,
        task_deadline=end_date
    )

    return jsonify({
        'complexity': complexity,
        'estimated_cost': base_cost,
        'assigned_team': assigned_team,
        'is_urgent': is_urgent,
        'recommended_technologies': ["React", "Node.js", "PostgreSQL"],
        'keywords': ["аутентификация", "API", "база данных"],
        'assigned_developer': selected_developer if selected_developer else "No suitable developer found"
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
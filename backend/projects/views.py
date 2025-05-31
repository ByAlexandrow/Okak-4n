import json
import requests
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_project_complexity(request):
    """
    Анализирует сложность проекта с помощью OpenRouter API
    """
    data = request.data
    description = data.get('description', '')
    team = data.get('team', '')
    project_type = data.get('projectType', '')
    timeline = data.get('timeline', '')
    
    # Создаем промпт для анализа
    prompt = f"""
Проанализируй проект на сложность и оцени стоимость разработки. Используй следующий формат ответа в JSON:

{{
  "complexity": "low/medium/high/critical",
  "estimatedCost": число,
  "estimatedHours": число,
  "recommendations": ["список", "рекомендаций"],
  "matchedKeywords": ["ключевые", "слова"],
  "riskFactors": ["факторы", "риска"]
}}

Данные проекта:
Описание: {description}
Тип проекта: {project_type}
Команда: {team}
Временные рамки: {timeline}

Критерии сложности:
- critical: AI, blockchain, distributed systems, real-time processing, микросервисы
- high: Мобильные приложения, платежные системы, интеграции, безопасность, CRM/ERP
- medium: Веб-приложения, порталы, базы данных, стандартные CRUD
- low: Лендинги, статические сайты, простые проекты

Расчет стоимости:
- Базовые ставки: low=2000₽/ч, medium=3500₽/ч, high=5000₽/ч, critical=7000₽/ч
- Множитель сложности: low=1, medium=1.5, high=2.5, critical=4
- Учитывай срочность (если срок <1 месяца, +30% к стоимости)
- Учитывай тип проекта и команду

Дай практические рекомендации по реализации проекта.
    """
    
    try:
        # Отправляем запрос к OpenRouter API
        response = requests.post(
            settings.OPENROUTER_API_URL,
            headers={
                'Authorization': f'Bearer {settings.OPENROUTER_API_KEY}',
                'Content-Type': 'application/json',
            },
            json={
                'model': 'deepseek/deepseek-chat',
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt,
                    },
                ],
                'response_format': {'type': 'json_object'},
            },
            timeout=30,
        )
        
        if response.status_code != 200:
            return Response(
                analyze_project_locally(description, team, project_type, timeline),
                status=status.HTTP_200_OK
            )
        
        data = response.json()
        content = data['choices'][0]['message']['content']
        
        # Удаляем маркеры форматирования Markdown, если они есть
        if content.startswith("```json") or content.startswith("```"):
            content = content.replace("```json", "").replace("```", "").strip()
        
        try:
            analysis_result = json.loads(content)
            return Response(analysis_result, status=status.HTTP_200_OK)
        except json.JSONDecodeError:
            # Если не удалось распарсить JSON, используем локальный анализ
            return Response(
                analyze_project_locally(description, team, project_type, timeline),
                status=status.HTTP_200_OK
            )
            
    except Exception as e:
        # В случае ошибки используем локальный анализ
        return Response(
            analyze_project_locally(description, team, project_type, timeline),
            status=status.HTTP_200_OK
        )

def analyze_project_locally(description, team, project_type, timeline):
    """
    Локальный анализ проекта без использования API
    """
    keywords = {
        'critical': [
            'ai', 'artificial intelligence', 'machine learning', 'blockchain',
            'cryptocurrency', 'микросервис', 'microservice', 'distributed', 'real-time',
        ],
        'high': [
            'mobile', 'мобильн', 'ios', 'android', 'payment', 'платеж',
            'integration', 'интеграц', 'crm', 'erp', 'security', 'безопасность',
        ],
        'medium': [
            'web', 'веб', 'website', 'сайт', 'portal', 'портал',
            'dashboard', 'админ', 'database', 'база данных',
        ],
        'low': [
            'landing', 'лендинг', 'static', 'статич', 'simple', 'простой', 'template', 'шаблон',
        ],
    }
    
    text = (description + ' ' + team + ' ' + project_type).lower()
    complexity = 'medium'  # По умолчанию
    matched_keywords = []
    
    # Определяем сложность по ключевым словам
    for level, words in keywords.items():
        matches = [word for word in words if word in text]
        if matches:
            complexity = level
            matched_keywords = matches
            break
    
    # Базовые ставки и множители
    base_rates = {
        'low': 2000,
        'medium': 3500,
        'high': 5000,
        'critical': 7000,
    }
    
    complexity_multipliers = {
        'low': 1,
        'medium': 1.5,
        'high': 2.5,
        'critical': 4,
    }
    
    # Оценка часов на основе описания и типа проекта
    base_hours = 40
    if len(description) > 500:
        base_hours += 40
    if len(description) > 1000:
        base_hours += 60
    
    project_type_multipliers = {
        'mobile': 1.5,
        'web': 1.0,
        'desktop': 1.3,
        'ai': 2.0,
        'blockchain': 2.5,
        'ecommerce': 1.4,
        'crm': 1.6,
    }
    
    type_multiplier = project_type_multipliers.get(project_type, 1.0)
    estimated_hours = round(base_hours * type_multiplier * complexity_multipliers[complexity])
    
    # Учитываем срочность
    urgency_multiplier = 1
    if '1-2weeks' in timeline or '1month' in timeline:
        urgency_multiplier = 1.3
    
    estimated_cost = round(base_rates[complexity] * estimated_hours * urgency_multiplier)
    
    # Генерируем рекомендации
    recommendations = []
    if complexity == 'critical':
        recommendations = [
            'Рекомендуется разбить проект на этапы',
            'Необходимо детальное техническое планирование',
            'Требуется опытная команда разработчиков',
        ]
    elif complexity == 'high':
        recommendations = [
            'Рекомендуется создать детальное ТЗ',
            'Необходимо планирование архитектуры',
        ]
    elif complexity == 'medium':
        recommendations = [
            'Стандартный подход к разработке',
            'Рекомендуется использовать проверенные технологии',
        ]
    else:
        recommendations = [
            'Можно использовать готовые решения',
            'Подходит для быстрой разработки',
        ]
    
    if '1-2weeks' in timeline:
        recommendations.append('Очень сжатые сроки - рекомендуется MVP подход')
    
    if project_type == 'mobile':
        recommendations.append('Рассмотрите кроссплатформенную разработку')
    
    # Генерируем факторы риска
    risk_factors = []
    if complexity in ['critical', 'high']:
        risk_factors.append('Высокая техническая сложность')
    
    if '1-2weeks' in timeline or '1month' in timeline:
        risk_factors.append('Сжатые сроки могут повлиять на качество')
    
    if len(description) < 100:
        risk_factors.append('Недостаточно детальное описание требований')
    
    if 'интеграция' in text or 'integration' in text:
        risk_factors.append('Зависимость от внешних систем')
    
    return {
        'complexity': complexity,
        'estimatedCost': estimated_cost,
        'estimatedHours': estimated_hours,
        'recommendations': recommendations,
        'matchedKeywords': matched_keywords,
        'riskFactors': risk_factors,
    }

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_request(request):
    """
    Принимает заявку на проект и сохраняет в базу данных
    """
    data = request.data
    
    # Создаем проект
    serializer = ProjectSerializer(data={
        'project_name': data.get('projectName'),
        'description': data.get('description'),
        'project_type': data.get('projectType'),
        'budget': data.get('budget'),
        'timeline': data.get('timeline'),
        'team': data.get('team'),
        'contact_email': data.get('contactEmail'),
        'contact_phone': data.get('contactPhone', ''),
        'additional_info': data.get('additionalInfo', ''),
        'status': 'new',
        'complexity': data.get('analysis', {}).get('complexity', 'medium'),
        'estimated_cost': data.get('analysis', {}).get('estimatedCost', 0),
        'analysis_data': data.get('analysis'),
    })
    
    if serializer.is_valid():
        project = serializer.save()
        
        # Здесь можно добавить отправку email уведомлений
        
        return Response({
            'success': True,
            'projectId': project.id,
            'message': 'Заявка успешно отправлена',
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'errors': serializer.errors,
        'message': 'Ошибка при отправке заявки',
    }, status=status.HTTP_400_BAD_REQUEST)

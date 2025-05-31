import { type NextRequest, NextResponse } from "next/server"

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
const API_KEY =
  process.env.OPENROUTER_API_KEY || "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"

interface AnalysisRequest {
  description: string
  team: string
  projectType: string
  timeline: string
}

interface AnalysisResult {
  complexity: "low" | "medium" | "high" | "critical"
  estimatedCost: number
  estimatedHours: number
  recommendations: string[]
  matchedKeywords: string[]
  riskFactors: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { description, team, projectType, timeline }: AnalysisRequest = await request.json()

    // Создаем промпт для анализа
    const prompt = `
Проанализируй проект на сложность и оцени стоимость разработки. Используй следующий формат ответа в JSON:

{
  "complexity": "low/medium/high/critical",
  "estimatedCost": число,
  "estimatedHours": число,
  "recommendations": ["список", "рекомендаций"],
  "matchedKeywords": ["ключевые", "слова"],
  "riskFactors": ["факторы", "риска"]
}

Данные проекта:
Описание: ${description}
Тип проекта: ${projectType}
Команда: ${team}
Временные рамки: ${timeline}

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
    `

    // Отправляем запрос к OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      console.error("OpenRouter API error:", response.status, response.statusText)
      // Fallback к локальному анализу
      return NextResponse.json(analyzeProjectLocally(description, team, projectType, timeline))
    }

    const data = await response.json()

    // Исправляем обработку ответа - проверяем и очищаем от маркеров форматирования
    let content = data.choices[0].message.content

    // Удаляем маркеры форматирования Markdown, если они есть
    if (content.startsWith("```json") || content.startsWith("```")) {
      content = content
        .replace(/^```json\s*/, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
    }

    try {
      // Пытаемся распарсить JSON
      const analysisResult = JSON.parse(content)
      return NextResponse.json(analysisResult)
    } catch (jsonError) {
      console.error("Error parsing JSON from API response:", jsonError)
      console.error("Raw content:", content)
      // Fallback к локальному анализу
      return NextResponse.json(analyzeProjectLocally(description, team, projectType, timeline))
    }
  } catch (error) {
    console.error("Error analyzing project:", error)
    // Fallback к локальному анализу
    const { description, team, projectType, timeline } = await request.json()
    return NextResponse.json(analyzeProjectLocally(description, team, projectType, timeline))
  }
}

function analyzeProjectLocally(
  description: string,
  team: string,
  projectType: string,
  timeline: string,
): AnalysisResult {
  const keywords = {
    critical: [
      "ai",
      "artificial intelligence",
      "machine learning",
      "blockchain",
      "cryptocurrency",
      "микросервис",
      "microservice",
      "distributed",
      "real-time",
    ],
    high: [
      "mobile",
      "мобильн",
      "ios",
      "android",
      "payment",
      "платеж",
      "integration",
      "интеграц",
      "crm",
      "erp",
      "security",
      "безопасность",
    ],
    medium: ["web", "веб", "website", "сайт", "portal", "портал", "dashboard", "админ", "database", "база данных"],
    low: ["landing", "лендинг", "static", "статич", "simple", "простой", "template", "шаблон"],
  }

  const text = (description + " " + team + " " + projectType).toLowerCase()
  let complexity: "low" | "medium" | "high" | "critical" = "medium"
  let matchedKeywords: string[] = []

  // Определяем сложность по ключевым словам
  for (const [level, words] of Object.entries(keywords)) {
    const matches = words.filter((word) => text.includes(word))
    if (matches.length > 0) {
      complexity = level as "low" | "medium" | "high" | "critical"
      matchedKeywords = matches
      break
    }
  }

  // Базовые ставки и множители
  const baseRates = {
    low: 2000,
    medium: 3500,
    high: 5000,
    critical: 7000,
  }

  const complexityMultipliers = {
    low: 1,
    medium: 1.5,
    high: 2.5,
    critical: 4,
  }

  // Оценка часов на основе описания и типа проекта
  let baseHours = 40
  if (description.length > 500) baseHours += 40
  if (description.length > 1000) baseHours += 60

  const projectTypeMultipliers: { [key: string]: number } = {
    mobile: 1.5,
    web: 1.0,
    desktop: 1.3,
    ai: 2.0,
    blockchain: 2.5,
    ecommerce: 1.4,
    crm: 1.6,
  }

  const typeMultiplier = projectTypeMultipliers[projectType] || 1.0
  const estimatedHours = Math.round(baseHours * typeMultiplier * complexityMultipliers[complexity])

  // Учитываем срочность
  let urgencyMultiplier = 1
  if (timeline.includes("1-2weeks") || timeline.includes("1month")) {
    urgencyMultiplier = 1.3
  }

  const estimatedCost = Math.round(baseRates[complexity] * estimatedHours * urgencyMultiplier)

  // Генерируем рекомендации
  const recommendations = generateRecommendations(complexity, projectType, timeline)
  const riskFactors = generateRiskFactors(complexity, timeline, description)

  return {
    complexity,
    estimatedCost,
    estimatedHours,
    recommendations,
    matchedKeywords,
    riskFactors,
  }
}

function generateRecommendations(complexity: string, projectType: string, timeline: string): string[] {
  const recommendations: string[] = []

  if (complexity === "critical") {
    recommendations.push("Рекомендуется разбить проект на этапы")
    recommendations.push("Необходимо детальное техническое планирование")
    recommendations.push("Требуется опытная команда разработчиков")
  } else if (complexity === "high") {
    recommendations.push("Рекомендуется создать детальное ТЗ")
    recommendations.push("Необходимо планирование архитектуры")
  } else if (complexity === "medium") {
    recommendations.push("Стандартный подход к разработке")
    recommendations.push("Рекомендуется использовать проверенные технологии")
  } else {
    recommendations.push("Можно использовать готовые решения")
    recommendations.push("Подходит для быстрой разработки")
  }

  if (timeline.includes("1-2weeks")) {
    recommendations.push("Очень сжатые сроки - рекомендуется MVP подход")
  }

  if (projectType === "mobile") {
    recommendations.push("Рассмотрите кроссплатформенную разработку")
  }

  return recommendations
}

function generateRiskFactors(complexity: string, timeline: string, description: string): string[] {
  const risks: string[] = []

  if (complexity === "critical" || complexity === "high") {
    risks.push("Высокая техническая сложность")
  }

  if (timeline.includes("1-2weeks") || timeline.includes("1month")) {
    risks.push("Сжатые сроки могут повлиять на качество")
  }

  if (description.length < 100) {
    risks.push("Недостаточно детальное описание требований")
  }

  if (description.toLowerCase().includes("интеграция") || description.toLowerCase().includes("integration")) {
    risks.push("Зависимость от внешних систем")
  }

  return risks
}

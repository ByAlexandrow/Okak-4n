"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, CheckCircle, Code, Users, Calendar, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    projectType: "",
    budget: "",
    timeline: "",
    team: "",
    contactEmail: "",
    contactPhone: "",
    additionalInfo: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Анализ проекта
      const analysisResponse = await fetch("/api/analyze-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.description,
          team: formData.team,
          projectType: formData.projectType,
          timeline: formData.timeline,
        }),
      })

      const analysisResult = await analysisResponse.json()
      setAnalysis(analysisResult)

      // Сохранение заявки
      const submitResponse = await fetch("/api/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          analysis: analysisResult,
          timestamp: new Date().toISOString(),
        }),
      })

      if (submitResponse.ok) {
        setIsSubmitted(true)
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время.",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-700">Заявка успешно отправлена!</CardTitle>
            <CardDescription>
              Ваша заявка принята и находится на рассмотрении. Мы свяжемся с вами в течение 24 часов.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysis && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Предварительный анализ проекта:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">Сложность:</span>
                    <Badge
                      variant={
                        analysis.complexity === "critical"
                          ? "destructive"
                          : analysis.complexity === "high"
                            ? "secondary"
                            : analysis.complexity === "medium"
                              ? "default"
                              : "outline"
                      }
                    >
                      {analysis.complexity === "critical"
                        ? "Критическая"
                        : analysis.complexity === "high"
                          ? "Высокая"
                          : analysis.complexity === "medium"
                            ? "Средняя"
                            : "Низкая"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Оценочная стоимость:</span>
                    <span className="font-semibold">{analysis.estimatedCost?.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>
                {analysis.recommendations && (
                  <div>
                    <h4 className="font-medium mb-2">Рекомендации:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {analysis.recommendations.map((rec: string, index: number) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 text-center">
              <Button onClick={() => window.location.reload()} variant="outline">
                Подать новую заявку
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DevRequest</h1>
                <p className="text-sm text-gray-500">Сервис заявок на разработку</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href="/admin">Админ панель</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Подача заявки на разработку ПО</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Заполните форму ниже, и наша система автоматически проанализирует ваш проект, оценит сложность и подберет
            подходящую команду разработчиков.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Бриф на создание ПО
            </CardTitle>
            <CardDescription>Предоставьте максимально подробную информацию о вашем проекте</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Основная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Название проекта *</Label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={(e) => handleInputChange("projectName", e.target.value)}
                    placeholder="Например: Мобильное приложение для доставки"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectType">Тип проекта *</Label>
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) => handleInputChange("projectType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип проекта" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Веб-приложение</SelectItem>
                      <SelectItem value="mobile">Мобильное приложение</SelectItem>
                      <SelectItem value="desktop">Десктопное приложение</SelectItem>
                      <SelectItem value="landing">Лендинг страница</SelectItem>
                      <SelectItem value="ecommerce">Интернет-магазин</SelectItem>
                      <SelectItem value="crm">CRM система</SelectItem>
                      <SelectItem value="ai">AI/ML решение</SelectItem>
                      <SelectItem value="blockchain">Blockchain проект</SelectItem>
                      <SelectItem value="other">Другое</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Описание проекта */}
              <div className="space-y-2">
                <Label htmlFor="description">Подробное описание проекта *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Опишите функциональность, цели проекта, целевую аудиторию, особые требования..."
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* Бюджет и сроки */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget">Предполагаемый бюджет</Label>
                  <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите диапазон бюджета" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50000-100000">50 000 - 100 000 ₽</SelectItem>
                      <SelectItem value="100000-300000">100 000 - 300 000 ₽</SelectItem>
                      <SelectItem value="300000-500000">300 000 - 500 000 ₽</SelectItem>
                      <SelectItem value="500000-1000000">500 000 - 1 000 000 ₽</SelectItem>
                      <SelectItem value="1000000+">Более 1 000 000 ₽</SelectItem>
                      <SelectItem value="discuss">Обсуждается</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Желаемые сроки</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите временные рамки" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2weeks">1-2 недели</SelectItem>
                      <SelectItem value="1month">1 месяц</SelectItem>
                      <SelectItem value="2-3months">2-3 месяца</SelectItem>
                      <SelectItem value="3-6months">3-6 месяцев</SelectItem>
                      <SelectItem value="6months+">Более 6 месяцев</SelectItem>
                      <SelectItem value="flexible">Гибкие сроки</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Команда */}
              <div className="space-y-2">
                <Label htmlFor="team">Предпочтения по команде</Label>
                <Textarea
                  id="team"
                  value={formData.team}
                  onChange={(e) => handleInputChange("team", e.target.value)}
                  placeholder="Укажите желаемый состав команды: дизайнеры, frontend, backend, mobile разработчики, QA и т.д."
                  className="min-h-[80px]"
                />
              </div>

              {/* Контактная информация */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email для связи *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Телефон</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Дополнительная информация</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  placeholder="Ссылки на примеры, техническое задание, макеты, особые пожелания..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto min-w-[200px]">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Анализируем проект...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Отправить заявку
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold">AI Анализ</h3>
              </div>
              <p className="text-sm text-gray-600">
                Автоматический анализ сложности проекта и оценка стоимости с помощью ИИ
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold">Подбор команды</h3>
              </div>
              <p className="text-sm text-gray-600">
                Автоматический подбор оптимальной команды разработчиков под ваш проект
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold">Планирование</h3>
              </div>
              <p className="text-sm text-gray-600">Составление реалистичного графика работ с учетом загрузки команд</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

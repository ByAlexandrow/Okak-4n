"use client"

import { useState } from "react"
import { FiCode, FiDollarSign, FiSend, FiLoader, FiCheckCircle } from "react-icons/fi"
import api from "../services/api"
import { useToast } from "../context/ToastContext"
import Header from "../components/Header"

const HomePage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    projectType: '',
    budget: '',
    timeline: '',
    team: '',
    contactEmail: '',
    contactPhone: '',
    additionalInfo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Анализ проекта
      const analysisResponse = await api.post('/api/projects/analyze/', {
        description: formData.description,
        team: formData.team,
        projectType: formData.projectType,
        timeline: formData.timeline,
      });

      const analysisResult = analysisResponse.data;
      setAnalysis(analysisResult);

      // Сохранение заявки
      const submitResponse = await api.post('/api/projects/submit/', {
        ...formData,
        analysis: analysisResult,
        timestamp: new Date().toISOString(),
      });

      if (submitResponse.data.success) {
        setIsSubmitted(true);
        showToast({
          title: 'Заявка отправлена!',
          message: 'Мы свяжемся с вами в ближайшее время.',
        });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      showToast({
        title: 'Ошибка',
        message: 'Не удалось отправить заявку. Попробуйте еще раз.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-700">Заявка успешно отправлена!</h2>
            <p className="text-gray-600 mt-2">
              Ваша заявка принята и находится на рассмотрении. Мы свяжемся с вами в течение 24 часов.
            </p>
          </div>
          
          {analysis && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-lg">Предварительный анализ проекта:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FiCode className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Сложность:</span>
                  <span className={`badge ${
                    analysis.complexity === 'critical' ? 'badge-red' :
                    analysis.complexity === 'high' ? 'badge-yellow' :
                    analysis.complexity === 'medium' ? 'badge-blue' : 'badge-green'
                  }`}>
                    {analysis.complexity === 'critical' ? 'Критическая' :
                     analysis.complexity === 'high' ? 'Высокая' :
                     analysis.complexity === 'medium' ? 'Средняя' : 'Низкая'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FiDollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Оценочная стоимость:</span>
                  <span className="font-semibold">{analysis.estimatedCost?.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              
              {analysis.recommendations && (
                <div>
                  <h4 className="font-medium mb-2">Рекомендации:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-outline"
            >
              Подать новую заявку
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Подача заявки на разработку ПО</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Заполните форму ниже, и наша система автоматически проанализирует ваш проект, оценит сложность и подберет
            подходящую команду разработчиков.
          </p>
        </div>

        <div className="card w-full">
          <div className="mb-4">
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <FiSend className="w-5 h-5" />
              Бриф на создание ПО
            </h3>
            <p className="text-gray-600 text-sm">Предоставьте максимально подробную информацию о вашем проекте</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="projectName" className="label">Название проекта *</label>
                <input
                  id="projectName"
                  type="text"
                  className="input"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  placeholder="Например: Мобильное приложение для доставки"
                  required
                />
              </div>
              <div>
                <label htmlFor="projectType" className="label">Тип проекта *</label>
                <select
                  id="projectType"
                  className="input"
                  value={formData.projectType}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
                  required
                >
                  <option value="">Выберите тип проекта</option>
                  <option value="web">Веб-приложение</option>
                  <option value="mobile">Мобильное приложение</option>
                  <option value="desktop">Десктопное приложение</option>
                  <option value="landing">Лендинг страница</option>
                  <option value="ecommerce">Интернет-магазин</option>
                  <option value="crm">CRM система</option>
                  <option value="ai">AI/ML решение</option>
                  <option value="blockchain">Blockchain проект</option>
                  <option value="other">Другое</option>
                </select>
              </div>
            </div>

            {/* Описание проекта */}
            <div>
              <label htmlFor="description" className="label">Подробное описание проекта *</label>
              <textarea
                id="description"
                className="input min-h-[120px]"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Опишите функциональность, цели проекта, целевую аудиторию, особые требования..."
                required
              />
            </div>

            {/* Бюджет и сроки */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="budget" className="label">Предполагаемый бюджет</label>
                <select
                  id="budget"
                  className="input"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                >
                  <option value="">Выберите диапазон бюджета</option>
                  <option value="50000-100000">50 000 - 100 000 ₽</option>
                  <option value="100000-300000">100 000 - 300 000 ₽</option>
                  <option value="300000-500000">300 000 - 500 000 ₽</option>
                  <option value="500000-1000000">500 000 - 1 000 000 ₽</option>
                  <option value="1000000+">Более 1 000 000 ₽</option>
                  <option value="discuss">Обсуждается</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className="label">Желаемые сроки</label>
                <select
                  id="timeline"
                  className="input"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                >
                  <option value="">Выберите временные рамки</option>
                  <option value="1-2weeks">1-2 недели</option>
                  <option value="1month">1 месяц</option>
                  <option value="2-3months">2-3 месяца</option>
                  <option value="3-6months">3-6 месяцев</option>
                  <option value="6months+">Более 6 месяцев</option>
                  <option value="flexible">Гибкие сроки</option>
                </select>
              </div>
            </div>

            {/* Команда */}
            <div>
              <label htmlFor="team" className="label">Предпочтения по команде</label>
              <textarea
                id="team"
                className="input min-h-[80px]"
                value={formData.team}
                onChange={(e) => handleInputChange('team', e.target.value)}
                placeholder="Укажите желаемый состав команды: дизайнеры, frontend, backend, mobile разработчики, QA и т.д."
              />
            </div>

            {/* Контактная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactEmail" className="label">Email для связи *</label>
                <input
                  id="contactEmail"
                  type="email"
                  className="input"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="label">Телефон</label>
                <input
                  id="contactPhone"
                  type="tel"
                  className="input"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>

            {/* Дополнительная информация */}
            <div>
              <label htmlFor="additionalInfo" className="label">Дополнительная информация</label>
              <textarea
                id="additionalInfo"
                className="input min-h-[80px]"
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                placeholder="Ссылки на примеры, техническое задание, макеты, особые пожелания..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button 
                type="submit" 
                className="btn btn-primary px-8 py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                    Анализируем проект...
                  </>
                ) : (
                  <>
                    <FiSend className="w-4 h-4 mr-2" />
                    Отправить заявку
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiCode className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold">AI Анализ</h3>
            </div>
            <p className="text-sm text-gray\

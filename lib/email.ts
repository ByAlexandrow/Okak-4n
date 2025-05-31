import nodemailer from "nodemailer"

// Настройка транспорта для отправки email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"DevRequest" <${process.env.EMAIL_FROM || "noreply@devrequest.com"}>`,
      to,
      subject,
      html,
    })

    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

export function generateClientNotification(projectName: string, complexity: string, estimatedCost: number) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #3b82f6;">Заявка успешно принята!</h2>
      <p>Ваша заявка на проект <strong>${projectName}</strong> была успешно получена и находится на рассмотрении.</p>
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Предварительный анализ:</h3>
        <p><strong>Сложность:</strong> ${complexity === "low" ? "Низкая" : complexity === "medium" ? "Средняя" : complexity === "high" ? "Высокая" : "Критическая"}</p>
        <p><strong>Оценочная стоимость:</strong> ${estimatedCost.toLocaleString("ru-RU")} ₽</p>
      </div>
      <p>Наш менеджер свяжется с вами в течение 24 часов для обсуждения деталей.</p>
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">С уважением, команда DevRequest</p>
    </div>
  `
}

export function generateManagerNotification(project: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #3b82f6;">Новая заявка на проект!</h2>
      <p>Поступила новая заявка на разработку проекта <strong>${project.projectName}</strong>.</p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Информация о проекте:</h3>
        <p><strong>Описание:</strong> ${project.description}</p>
        <p><strong>Тип проекта:</strong> ${project.projectType}</p>
        <p><strong>Бюджет:</strong> ${project.budget || "Не указан"}</p>
        <p><strong>Сроки:</strong> ${project.timeline || "Не указаны"}</p>
        <p><strong>Контакт:</strong> ${project.contactEmail} ${project.contactPhone ? `/ ${project.contactPhone}` : ""}</p>
      </div>
      
      <div style="background-color: #f0f9ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #3b82f6;">Результаты анализа:</h3>
        <p><strong>Сложность:</strong> ${project.complexity === "low" ? "Низкая" : project.complexity === "medium" ? "Средняя" : project.complexity === "high" ? "Высокая" : "Критическая"}</p>
        <p><strong>Оценочная стоимость:</strong> ${project.estimatedCost.toLocaleString("ru-RU")} ₽</p>
      </div>
      
      <a href="${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/admin" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Открыть в админ панели</a>
    </div>
  `
}

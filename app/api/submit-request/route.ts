import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"
import { sendEmail, generateClientNotification, generateManagerNotification } from "@/lib/email"

interface ProjectRequest {
  projectName: string
  description: string
  projectType: string
  budget: string
  timeline: string
  team: string
  contactEmail: string
  contactPhone: string
  additionalInfo: string
  analysis: any
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const projectData: ProjectRequest = await request.json()

    // Создаем новый проект в базе данных
    const newProject = await prisma.project.create({
      data: {
        projectName: projectData.projectName,
        description: projectData.description,
        projectType: projectData.projectType,
        budget: projectData.budget,
        timeline: projectData.timeline,
        team: projectData.team,
        contactEmail: projectData.contactEmail,
        contactPhone: projectData.contactPhone || "",
        additionalInfo: projectData.additionalInfo || "",
        status: "new",
        complexity: projectData.analysis?.complexity || "medium",
        estimatedCost: projectData.analysis?.estimatedCost || 0,
        timestamp: new Date(),
        analysisData: projectData.analysis ? JSON.stringify(projectData.analysis) : null,
      },
    })

    // Отправляем уведомление клиенту
    await sendEmail({
      to: projectData.contactEmail,
      subject: `Заявка на проект "${projectData.projectName}" принята`,
      html: generateClientNotification(
        projectData.projectName,
        projectData.analysis?.complexity || "medium",
        projectData.analysis?.estimatedCost || 0,
      ),
    })

    // Отправляем уведомление менеджерам
    const managers = await prisma.user.findMany({
      where: {
        role: {
          in: ["admin", "manager"],
        },
      },
    })

    for (const manager of managers) {
      if (manager.username.includes("@")) {
        // Проверяем, что username - это email
        await sendEmail({
          to: manager.username,
          subject: `Новая заявка: ${projectData.projectName}`,
          html: generateManagerNotification(newProject),
        })
      }
    }

    return NextResponse.json({
      success: true,
      projectId: newProject.id,
      message: "Заявка успешно отправлена",
    })
  } catch (error) {
    console.error("Error submitting request:", error)
    return NextResponse.json({ success: false, message: "Ошибка при отправке заявки" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        timestamp: "desc",
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

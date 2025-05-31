import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db"

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

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()

    const project = await prisma.project.create({
      data: {
        ...projectData,
        timestamp: new Date(),
        analysisData: projectData.analysis ? JSON.stringify(projectData.analysis) : null,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

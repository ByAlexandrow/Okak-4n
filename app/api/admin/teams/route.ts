import { NextResponse } from "next/server"

const teams = [
  {
    name: "Mobile Team Alpha",
    type: "Мобильная разработка",
    members: 5,
    activeProjects: 2,
    skills: ["React Native", "iOS", "Android", "Flutter", "Swift", "Kotlin"],
    availability: 60,
  },
  {
    name: "Web Team Beta",
    type: "Веб-разработка",
    members: 6,
    activeProjects: 3,
    skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    availability: 45,
  },
  {
    name: "AI Innovation Lab",
    type: "Искусственный интеллект",
    members: 4,
    activeProjects: 1,
    skills: ["Python", "TensorFlow", "PyTorch", "NLP", "Computer Vision"],
    availability: 80,
  },
  {
    name: "Backend Core Team",
    type: "Backend разработка",
    members: 7,
    activeProjects: 4,
    skills: ["Node.js", "Python", "Go", "Docker", "Kubernetes", "AWS"],
    availability: 30,
  },
  {
    name: "Design Studio",
    type: "UI/UX Дизайн",
    members: 4,
    activeProjects: 2,
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    availability: 70,
  },
  {
    name: "QA Excellence",
    type: "Тестирование",
    members: 3,
    activeProjects: 5,
    skills: ["Manual Testing", "Automation", "Selenium", "Jest", "Cypress"],
    availability: 25,
  },
]

export async function GET() {
  return NextResponse.json(teams)
}

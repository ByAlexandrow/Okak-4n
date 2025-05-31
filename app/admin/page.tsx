"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, FolderOpen, Calendar, DollarSign, Clock, CheckCircle, Eye, LogOut, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ComplexityChart } from "@/components/charts/complexity-chart"
import { StatusChart } from "@/components/charts/status-chart"

interface Project {
  id: string
  projectName: string
  description: string
  projectType: string
  budget: string
  timeline: string
  team: string
  contactEmail: string
  contactPhone: string
  status: "new" | "in-progress" | "review" | "completed"
  complexity: "low" | "medium" | "high" | "critical"
  estimatedCost: number
  assignedTeam?: string
  timestamp: string
  analysis?: any
}

interface Team {
  name: string
  type: string
  members: number
  activeProjects: number
  skills: string[]
  availability: number
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [projects, setProjects] = useState<Project[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects()
      loadTeams()
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Простая аутентификация для демо
    if (
      (loginForm.username === "admin" && loginForm.password === "admin") ||
      (loginForm.username === "manager" && loginForm.password === "manager")
    ) {
      setIsAuthenticated(true)
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в админ панель!",
      })
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин или пароль",
        variant: "destructive",
      })
    }
  }

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects")
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Error loading projects:", error)
    }
  }

  const loadTeams = async () => {
    try {
      const response = await fetch("/api/admin/teams")
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error("Error loading teams:", error)
    }
  }

  const updateProjectStatus = async (projectId: string, status: string, assignedTeam?: string) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, assignedTeam }),
      })

      if (response.ok) {
        loadProjects()
        toast({
          title: "Проект обновлен",
          description: "Статус проекта успешно изменен",
        })
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить проект",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "default",
      "in-progress": "secondary",
      review: "outline",
      completed: "default",
    } as const

    const labels = {
      new: "Новая",
      "in-progress": "В работе",
      review: "На проверке",
      completed: "Завершена",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getComplexityBadge = (complexity: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    }

    const labels = {
      low: "Низкая",
      medium: "Средняя",
      high: "Высокая",
      critical: "Критическая",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[complexity as keyof typeof colors]}`}>
        {labels[complexity as keyof typeof labels]}
      </span>
    )
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getProjectsByStatus = (status: string) => {
    return projects.filter((p) => p.status === status)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Вход в систему</CardTitle>
            <CardDescription>Введите ваши учетные данные</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="admin или manager"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="admin или manager"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Войти
              </Button>
              <div className="text-sm text-gray-500 text-center">
                <p>Тестовые аккаунты:</p>
                <p>admin / admin или manager / manager</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DevRequest Admin</h1>
                <p className="text-sm text-gray-500">Панель управления проектами</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <a href="/">На главную</a>
              </Button>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Всего проектов</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <FolderOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">В работе</p>
                  <p className="text-2xl font-bold">{getProjectsByStatus("in-progress").length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Завершено</p>
                  <p className="text-2xl font-bold">{getProjectsByStatus("completed").length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Активных команд</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Проекты</TabsTrigger>
            <TabsTrigger value="teams">Команды</TabsTrigger>
            <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Поиск проектов..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Фильтр по статусу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все статусы</SelectItem>
                      <SelectItem value="new">Новые</SelectItem>
                      <SelectItem value="in-progress">В работе</SelectItem>
                      <SelectItem value="review">На проверке</SelectItem>
                      <SelectItem value="completed">Завершенные</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.projectName}</CardTitle>
                        <CardDescription className="mt-1">{project.description.substring(0, 100)}...</CardDescription>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedProject(project)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{project.projectName}</DialogTitle>
                            <DialogDescription>Детали проекта</DialogDescription>
                          </DialogHeader>
                          {selectedProject && (
                            <div className="space-y-4">
                              <div>
                                <Label className="font-semibold">Описание:</Label>
                                <p className="text-sm text-gray-600 mt-1">{selectedProject.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="font-semibold">Тип проекта:</Label>
                                  <p className="text-sm text-gray-600">{selectedProject.projectType}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Бюджет:</Label>
                                  <p className="text-sm text-gray-600">{selectedProject.budget}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Сроки:</Label>
                                  <p className="text-sm text-gray-600">{selectedProject.timeline}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">Команда:</Label>
                                  <p className="text-sm text-gray-600">{selectedProject.team || "Не указана"}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="font-semibold">Контакты:</Label>
                                <p className="text-sm text-gray-600">{selectedProject.contactEmail}</p>
                                {selectedProject.contactPhone && (
                                  <p className="text-sm text-gray-600">{selectedProject.contactPhone}</p>
                                )}
                              </div>
                              {selectedProject.analysis && (
                                <div>
                                  <Label className="font-semibold">Анализ проекта:</Label>
                                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm">Сложность:</span>
                                      {getComplexityBadge(selectedProject.complexity)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm">Оценочная стоимость:</span>
                                      <span className="font-semibold">
                                        {selectedProject.estimatedCost?.toLocaleString("ru-RU")} ₽
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Select
                                  value={selectedProject.status}
                                  onValueChange={(value) =>
                                    updateProjectStatus(selectedProject.id, value, selectedProject.assignedTeam)
                                  }
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">Новая</SelectItem>
                                    <SelectItem value="in-progress">В работе</SelectItem>
                                    <SelectItem value="review">На проверке</SelectItem>
                                    <SelectItem value="completed">Завершена</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={selectedProject.assignedTeam || ""}
                                  onValueChange={(value) =>
                                    updateProjectStatus(selectedProject.id, selectedProject.status, value)
                                  }
                                >
                                  <SelectTrigger className="flex-1">
                                    <SelectValue placeholder="Назначить команду" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {teams.map((team) => (
                                      <SelectItem key={team.name} value={team.name}>
                                        {team.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        {getStatusBadge(project.status)}
                        {getComplexityBadge(project.complexity)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{project.estimatedCost?.toLocaleString("ru-RU")} ₽</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.timestamp).toLocaleDateString("ru-RU")}</span>
                      </div>
                      {project.assignedTeam && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{project.assignedTeam}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Card key={team.name}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      {team.name}
                    </CardTitle>
                    <CardDescription>{team.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Участников:</span>
                        <span className="font-semibold">{team.members}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Активных проектов:</span>
                        <span className="font-semibold">{team.activeProjects}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Доступность:</span>
                        <span
                          className={`font-semibold ${team.availability > 70 ? "text-green-600" : team.availability > 40 ? "text-yellow-600" : "text-red-600"}`}
                        >
                          {team.availability}%
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Навыки:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {team.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${team.availability > 70 ? "bg-green-500" : team.availability > 40 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${team.availability}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComplexityChart
                data={[
                  { complexity: "low", count: projects.filter((p) => p.complexity === "low").length },
                  { complexity: "medium", count: projects.filter((p) => p.complexity === "medium").length },
                  { complexity: "high", count: projects.filter((p) => p.complexity === "high").length },
                  { complexity: "critical", count: projects.filter((p) => p.complexity === "critical").length },
                ]}
              />
              <StatusChart
                data={[
                  { status: "new", count: projects.filter((p) => p.status === "new").length },
                  { status: "in-progress", count: projects.filter((p) => p.status === "in-progress").length },
                  { status: "review", count: projects.filter((p) => p.status === "review").length },
                  { status: "completed", count: projects.filter((p) => p.status === "completed").length },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

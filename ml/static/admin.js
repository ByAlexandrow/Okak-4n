// --- User Auth, Global Vars ---
const users = {
  admin: { password: "admin", name: "Администратор" },
  root: { password: "root", name: "Root Admin" },
  user: { password: "user", name: "Пользователь" },
}

let currentLoggedInUser = null
let draggedTask = null
let currentEditingProjectId = null

// DOM Elements
const loginFormEl = document.getElementById("loginForm")
const loginContainerEl = document.getElementById("loginContainer")
const adminDashboardEl = document.getElementById("adminDashboard")
const currentUserNameEl = document.getElementById("currentUserName")
const userAvatarInitialEl = document.getElementById("userAvatarInitial")
const projectDetailsModal = document.getElementById("projectDetailsModal")
const modalProjectName = document.getElementById("modalProjectName")
const modalBodyContent = document.getElementById("modalBodyContent")
const closeModalBtn = document.getElementById("closeModalBtn")
const editProjectBtn = document.getElementById("editProjectBtn")
const saveChangesBtn = document.getElementById("saveChangesBtn")
const cancelEditBtn = document.getElementById("cancelEditBtn")
const loadingOverlay = document.getElementById("loadingOverlay")
const logoutBtn = document.querySelector(".logout-btn")

// --- Constants ---
const BASE_RATES = {
  low: 1800,
  medium: 2500,
  high: 3200,
  critical: 4000
}

const COMPLEXITY_MULTIPLIERS = {
  low: 1.0,
  medium: 1.5,
  high: 2.0,
  critical: 3.0
}

const KANBAN_COLUMNS_CONFIG = {
  new: { title: "Новые задачи" },
  "in-progress": { title: "В работе" },
  review: { title: "На проверке" },
  completed: { title: "Закрытые" },
}

const TEAM_TYPES_CONFIG = {
  Designers: { icon: "🎨", name: "Дизайнеры", keywords: ["дизайн", "design", "ui", "ux"] },
  Web: { icon: "💻", name: "Web Разработка", keywords: ["web", "веб", "сайт", "html", "css", "js", "php", "портал"] },
  Mobile: {
    icon: "📱",
    name: "Mobile Разработка",
    keywords: ["mobile", "мобильн", "ios", "android", "flutter", "swift", "kotlin"],
  },
  Backend: {
    icon: "⚙️",
    name: "Backend Разработка",
    keywords: ["backend", "сервер", "api", "баз данн", "database", "node", "python", "java", "go"],
  },
  Frontend: {
    icon: "🖼️",
    name: "Frontend Разработка",
    keywords: ["frontend", "интерфейс", "клиентск", "react", "vue", "angular"],
  },
  Desktop: {
    icon: "🖥️",
    name: "Desktop Разработка",
    keywords: ["desktop", "десктоп", "windows", "macos", "linux", "c#", ".net"],
  },
  QA: { icon: "🐞", name: "Тестирование (QA)", keywords: ["test", "qa", "тестир", "quality"] },
  Other: { icon: "🧩", name: "Другое", keywords: ["other", "разное", "прочее", "аналитика"] },
}

// --- API Functions ---
async function analyzeComplexity(description, technologies = []) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const COMPLEXITY_KEYWORDS = {
      critical: [
        "ai",
        "artificial intelligence",
        "machine learning",
        "ml",
        "neural network",
        "blockchain",
        "cryptocurrency",
        "distributed system",
        "микросервис",
        "microservice",
        "real-time",
        "реальное время",
        "high load",
        "высокая нагрузка",
        "scalability",
      ],
      high: [
        "mobile app",
        "мобильное приложение",
        "ios",
        "android",
        "react native",
        "flutter",
        "cms",
        "crm",
        "erp",
        "integration",
        "интеграция",
        "api gateway",
        "payment",
        "платежи",
        "security",
        "безопасность",
        "authentication",
        "авторизация",
      ],
      medium: [
        "web application",
        "веб приложение",
        "website",
        "сайт",
        "portal",
        "портал",
        "dashboard",
        "админка",
        "admin panel",
        "database",
        "база данных",
        "crud",
      ],
      low: [
        "landing page",
        "лендинг",
        "static site",
        "статический сайт",
        "simple",
        "простой",
        "basic",
        "базовый",
        "template",
        "шаблон",
      ],
    }

    const text = (description + " " + technologies.join(" ")).toLowerCase()
    let complexityScore = 0
    const matchedKeywords = []

    for (const [level, keywords] of Object.entries(COMPLEXITY_KEYWORDS)) {
      const matches = keywords.filter((keyword) => text.includes(keyword.toLowerCase()))
      if (matches.length > 0) {
        matchedKeywords.push(...matches)
        switch (level) {
          case "critical":
            complexityScore += matches.length * 4
            break
          case "high":
            complexityScore += matches.length * 3
            break
          case "medium":
            complexityScore += matches.length * 2
            break
          case "low":
            complexityScore += matches.length * 1
            break
        }
      }
    }

    let complexity
    if (complexityScore >= 12) complexity = "critical"
    else if (complexityScore >= 8) complexity = "high"
    else if (complexityScore >= 4) complexity = "medium"
    else complexity = "low"

    const factors = {
      descriptionLength: description.length > 500 ? "detailed" : description.length > 200 ? "moderate" : "brief",
    }

    return {
      complexity,
      score: Math.round(complexityScore * 10) / 10,
      matchedKeywords,
      factors,
    }
  } catch (error) {
    console.error("Error analyzing complexity:", error)
    return analyzeComplexityLocal(description)
  }
}

function calculateCost(description, complexity, startDate, endDate) {
  const MAX_DURATION = 365
  const MAX_COST = {
    low: 5000000,
    medium: 10000000,
    high: 20000000,
    critical: 50000000
  }

  const start = new Date(startDate)
  const end = new Date(endDate)
  let durationDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

  if (durationDays > MAX_DURATION) {
    durationDays = MAX_DURATION
  }

  const baseHours = Math.min(Math.max(40, durationDays * 8), durationDays * 6)
  const descriptionComplexity = description.length > 500 ? 1.5 : description.length > 200 ? 1.2 : 1
  const estimatedHours = baseHours * descriptionComplexity

  const multiplier = COMPLEXITY_MULTIPLIERS[complexity]
  const baseRate = BASE_RATES[complexity]
  const isUrgent = durationDays < 30
  const urgencyMultiplier = isUrgent ? 1.3 : 1

  let totalCost = Math.round(baseRate * estimatedHours * multiplier * urgencyMultiplier)
  totalCost = Math.min(totalCost, MAX_COST[complexity])

  return {
    estimatedCost: totalCost,
    breakdown: {
      baseHours: Math.round(baseHours),
      estimatedHours: Math.round(estimatedHours),
      baseRate,
      complexityMultiplier: multiplier,
      urgencyMultiplier,
      durationDays,
      isUrgent
    }
  }
}

function calculateCostLocal(description, complexity) {
  const BASE_RATE = 2500

  const complexityMultipliers = {
    low: 1,
    medium: 1.5,
    high: 2.5,
    critical: 4,
  }

  const estimatedHours = Math.max(40, description.length * 2)
  const multiplier = complexityMultipliers[complexity]
  const urgencyMultiplier = 1

  const totalCost = Math.round((BASE_RATE * estimatedHours * multiplier * urgencyMultiplier) / 100) * 100

  return {
    estimatedCost: totalCost,
    breakdown: {
      baseHours: Math.round(estimatedHours),
      avgHourlyRate: BASE_RATE,
      complexityMultiplier: multiplier,
      urgencyMultiplier: urgencyMultiplier,
    }
  }
}

// --- Fallback Functions ---
function analyzeComplexityLocal(description) {
  const keywords = {
    critical: ["ai", "machine learning", "blockchain", "микросервис", "distributed"],
    high: ["mobile", "мобильн", "cms", "crm", "интеграц", "api"],
    medium: ["web", "сайт", "портал", "админ", "dashboard"],
    low: ["лендинг", "landing", "статич", "простой"],
  }

  const text = description.toLowerCase()

  for (const [level, words] of Object.entries(keywords)) {
    if (words.some((word) => text.includes(word))) {
      return {
        complexity: level,
        score: level === "critical" ? 10 : level === "high" ? 7 : level === "medium" ? 4 : 2,
        matchedKeywords: words.filter((word) => text.includes(word)),
        factors: {
          descriptionLength: description.length > 200 ? "detailed" : "brief",
        },
      }
    }
  }

  return {
    complexity: "medium",
    score: 4,
    matchedKeywords: [],
    factors: {
      descriptionLength: description.length > 200 ? "detailed" : "brief",
    },
  }
}

function getComplexityRecommendations(complexity) {
  const recommendations = {
    critical: [
      "Рекомендуется разбить проект на этапы",
      "Необходимо детальное техническое планирование",
      "Требуется опытная команда разработчиков",
    ],
    high: ["Рекомендуется создать детальное ТЗ", "Необходимо планирование архитектуры"],
    medium: ["Стандартный подход к разработке", "Рекомендуется использовать проверенные технологии"],
    low: ["Можно использовать готовые решения", "Подходит для быстрой разработки"],
  }

  return recommendations[complexity] || recommendations.medium
}

function showAnalysisResults(complexityResult, costResult) {
  const analysisResults = document.getElementById("analysisResults")
  const analysisContent = analysisResults.querySelector(".analysis-content")

  const isUrgent = costResult.breakdown.isUrgent
  const urgencyText = isUrgent
    ? `<div class="analysis-item urgent-notice">
      <strong>Срочный проект:</strong>
      <span>Применена надбавка +30%</span>
    </div>`
    : ""

  analysisContent.innerHTML = `
        <div class="analysis-item">
            <strong>Сложность:</strong>
            <span class="complexity-${complexityResult.complexity}">${getComplexityName(complexityResult.complexity)}</span>
        </div>
        <div class="analysis-item">
            <strong>Оценочная стоимость:</strong>
            <span>${costResult.estimatedCost.toLocaleString("ru-RU")} ₽</span>
        </div>
        <div class="analysis-item">
            <strong>Оценочные часы:</strong>
            <span>${costResult.breakdown.estimatedHours || costResult.breakdown.baseHours} ч</span>
        </div>
        <div class="analysis-item">
            <strong>Средняя ставка:</strong>
            <span>${costResult.breakdown.baseRate || costResult.breakdown.avgHourlyRate} ₽/ч</span>
        </div>
        ${urgencyText}
        ${
          complexityResult.matchedKeywords && complexityResult.matchedKeywords.length > 0
            ? `
        <div class="analysis-item">
            <strong>Ключевые слова:</strong>
            <span>${complexityResult.matchedKeywords.join(", ")}</span>
        </div>
        `
            : ""
        }
    `

  analysisResults.style.display = "block"
}

// --- Event Listeners ---
loginFormEl.addEventListener("submit", (e) => {
  e.preventDefault()
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  if (users[username] && users[username].password === password) {
    currentLoggedInUser = users[username]
    loginContainerEl.style.display = "none"
    adminDashboardEl.classList.add("active")
    currentUserNameEl.textContent = currentLoggedInUser.name
    userAvatarInitialEl.textContent = currentLoggedInUser.name.substring(0, 1).toUpperCase()
    initializeDashboard()
  } else {
    alert("Неверный логин или пароль")
  }
})

logoutBtn.addEventListener("click", logout)

function logout() {
  currentLoggedInUser = null
  loginContainerEl.style.display = "flex"
  adminDashboardEl.classList.remove("active")
  loginFormEl.reset()
}

closeModalBtn.onclick = () => {
  projectDetailsModal.classList.remove("active")
  exitEditMode()
}

window.onclick = (event) => {
  if (event.target == projectDetailsModal) {
    projectDetailsModal.classList.remove("active")
    exitEditMode()
  }
}

editProjectBtn.onclick = () => {
  enterEditMode()
}

cancelEditBtn.onclick = () => {
  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")
  const project = projects.find((p) => p.id === currentEditingProjectId)
  populateModalDetails(project, false)
  exitEditMode()
}

saveChangesBtn.onclick = () => {
  saveProjectChanges()
}

// --- Search Functionality ---
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("projectSearchInput")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase().trim()
      searchProjects(searchTerm)
    })
  }
})

function searchProjects(searchTerm) {
  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")
  const filteredProjects = projects.filter((project) => {
    return (
      (project.projectName && project.projectName.toLowerCase().includes(searchTerm)) ||
      (project.projectDescription && project.projectDescription.toLowerCase().includes(searchTerm))
    )
  })

  if (document.getElementById("projects-section").classList.contains("active")) {
    displaySearchResults(filteredProjects, searchTerm)
  }
}

function displaySearchResults(projects, searchTerm) {
  const board = document.getElementById("kanbanBoard")
  if (!board) return

  if (!searchTerm || searchTerm.length < 2) {
    loadProjectsBoard()
    return
  }

  board.innerHTML = ""

  const searchResultsContainer = document.createElement("div")
  searchResultsContainer.className = "search-results-container"
  searchResultsContainer.innerHTML = `
    <div class="search-results-header">
      <h3>Результаты поиска: "${searchTerm}"</h3>
      <span class="search-count">${projects.length} проект(ов) найдено</span>
      <button class="clear-search-btn">Очистить поиск</button>
    </div>
    <div class="search-results-list"></div>
  `

  board.appendChild(searchResultsContainer)

  const resultsList = searchResultsContainer.querySelector(".search-results-list")

  projects.forEach((project) => {
    const card = createTaskCard(project)
    resultsList.appendChild(card)
  })

  const clearBtn = searchResultsContainer.querySelector(".clear-search-btn")
  clearBtn.addEventListener("click", () => {
    document.getElementById("projectSearchInput").value = ""
    loadProjectsBoard()
  })
}

// --- Initialization and Navigation ---
function initializeDashboard() {
  setupNavigation()
  loadProjectsBoard()
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("projectStartDateForm").min = today
  document.getElementById("projectEndDateForm").min = today
  setupAutomaticAnalysis()
}

function setupAutomaticAnalysis() {
  const descriptionField = document.getElementById("projectDescriptionForm")
  const startDateField = document.getElementById("projectStartDateForm")
  const endDateField = document.getElementById("projectEndDateForm")
  const costField = document.getElementById("projectCostForm")
  const hoursField = document.getElementById("projectHoursForm")
  const complexityDisplay = document.getElementById("complexityDisplay")
  const analysisResults = document.getElementById("analysisResults")

  let analysisTimeout
  ;[descriptionField, startDateField, endDateField].forEach((field) => {
    field.addEventListener("input", () => {
      clearTimeout(analysisTimeout)
      analysisTimeout = setTimeout(async () => {
        const description = descriptionField.value.trim()
        const startDate = startDateField.value
        const endDate = endDateField.value

        if (description && startDate && endDate) {
          try {
            const complexityResult = await analyzeComplexity(description)
            //updateComplexityDisplay(complexityResult.complexity)

            const costResult = await calculateCost(description, complexityResult.complexity, startDate, endDate)
            if (!costField.value) costField.value = costResult.estimatedCost
            if (!hoursField.value) hoursField.value = costResult.breakdown.estimatedHours
            showAnalysisResults(complexityResult, costResult)
          } catch (error) {
            console.error("Auto-analysis failed:", error)
          }
        }
      }, 500)
    })
  })
  costField.addEventListener("input", () => {
    if (costField.value) hoursField.value = ""
  })
  hoursField.addEventListener("input", () => {
    if (hoursField.value) costField.value = ""
  })
}

function updateComplexityDisplay(complexity) {
  const complexityLevel = document.querySelector(".complexity-level")
  const complexityNames = {
    low: "Низкая",
    medium: "Средняя",
    high: "Высокая",
    critical: "Критическая",
  }

  complexityLevel.textContent = complexityNames[complexity] || "Рассчитывается автоматически"
  complexityLevel.className = `complexity-level complexity-${complexity}`
}

function setupNavigation() {
  const sidebarButtons = document.querySelectorAll(".sidebar-menu button")
  const sections = document.querySelectorAll(".content-area .section")
  const headerCreateBtn = document.getElementById("headerCreateTaskBtn")
  const cancelProjectBtn = document.getElementById("cancelProjectCreation")

  function showSection(sectionId) {
    sections.forEach((s) => s.classList.remove("active"))
    sidebarButtons.forEach((b) => b.classList.remove("active"))

    const targetSection = document.getElementById(`${sectionId}-section`)
    if (targetSection) targetSection.classList.add("active")

    const activeBtn = document.querySelector(`.sidebar-menu button[data-section="${sectionId}"]`)
    if (activeBtn) activeBtn.classList.add("active")

    if ("projects" === sectionId) loadProjectsBoard()
    else if ("teams" === sectionId) loadTeamsData()
  }

  sidebarButtons.forEach((btn) => btn.addEventListener("click", () => showSection(btn.getAttribute("data-section"))))
  headerCreateBtn.addEventListener("click", () => showSection("create-project"))
  cancelProjectBtn.addEventListener("click", () => showSection("projects"))
}

// --- Kanban Board Logic (Projects) ---
function loadProjectsBoard() {
  const board = document.getElementById("kanbanBoard")
  board.innerHTML = ""
  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")

  Object.keys(KANBAN_COLUMNS_CONFIG).forEach((statusKey) => {
    const colCfg = KANBAN_COLUMNS_CONFIG[statusKey]
    const colDiv = document.createElement("div")
    colDiv.className = "kanban-column"
    colDiv.id = `column-${statusKey}`
    colDiv.innerHTML = `
            <div class="kanban-column-header">
                <span class="kanban-column-title">${colCfg.title}</span>
                <span class="task-count-bubble" id="count-${statusKey}">0</span>
            </div>
            <div class="kanban-tasks" id="tasks-${statusKey}"></div>
        `
    board.appendChild(colDiv)

    colDiv.addEventListener("dragover", (e) => {
      e.preventDefault()
      colDiv.classList.add("drag-over")
    })
    colDiv.addEventListener("dragleave", () => colDiv.classList.remove("drag-over"))
    colDiv.addEventListener("drop", (e) => {
      e.preventDefault()
      colDiv.classList.remove("drag-over")
      if (draggedTask) {
        const targetStatus = statusKey
        updateTaskStatus(draggedTask.id, targetStatus)
      }
    })
  })

  projects.forEach((p) => {
    const status = p.status || "new"
    const tasksContainer = document.getElementById(`tasks-${status}`)
    if (tasksContainer) {
      const card = createTaskCard(p)
      card.addEventListener("dragstart", () => {
        draggedTask = p
        card.classList.add("dragging")
      })
      card.addEventListener("dragend", () => {
        card.classList.remove("dragging")
        draggedTask = null
      })
      tasksContainer.appendChild(card)
    }
    const countEl = document.getElementById(`count-${status}`)
    if (countEl) countEl.textContent = Number.parseInt(countEl.textContent) + 1
  })
}

function updateTaskStatus(projectId, newStatus) {
  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")
  const projectIndex = projects.findIndex((p) => p.id === projectId)
  if (projectIndex !== -1) {
    projects[projectIndex].status = newStatus
    localStorage.setItem("projects_data", JSON.stringify(projects))
    loadProjectsBoard()
    if (projectDetailsModal.classList.contains("active") && currentEditingProjectId === projectId) {
      populateModalDetails(projects[projectIndex], false)
    }
  }
}

function calculateProgress(startDateStr, endDateStr, status) {
  if (status === "completed") return 100
  if (status === "new" || !startDateStr || !endDateStr) return 0

  const start = new Date(startDateStr)
  const end = new Date(endDateStr)
  const today = new Date()

  if (today < start) return 0
  if (today >= end) return status === "review" ? 90 : 100

  const totalDuration = end - start
  const elapsed = today - start

  return totalDuration <= 0
    ? status === "review"
      ? 90
      : status === "in-progress"
        ? 50
        : 0
    : Math.min(Math.floor((elapsed / totalDuration) * 100), status === "review" ? 90 : 100)
}

function createTaskCard(p) {
  const card = document.createElement("div")
  card.className = `task-card status-${p.status || "new"}`
  card.id = `task-${p.id}`
  card.draggable = "true"
  const progressPercent = calculateProgress(p.projectStartDate, p.projectEndDate, p.status)

  const complexityBadge = p.complexity
    ? `<span class="complexity-level complexity-${p.complexity}">${getComplexityName(p.complexity)}</span>`
    : ""

  card.innerHTML = `
        <div class="task-card-actions">
            <button class="view-details-btn" title="Детали">👁️</button>
        </div>
        <div class="task-card-title">${p.projectName || "Без названия"}</div>
        <div class="task-card-description">${p.projectDescription ? p.projectDescription.substring(0, 70) + (p.projectDescription.length > 70 ? "..." : "") : "Нет описания"}</div>
        <div class="task-card-details">
            ${p.estimatedCost ? `<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> ${Number.parseFloat(p.estimatedCost).toLocaleString("ru-RU")} ₽</div>` : ""}
            ${complexityBadge ? `<div>🎯 ${complexityBadge}</div>` : ""}
        </div>
        ${p.projectStartDate && p.projectEndDate ? `<div class="schedule-bar-container"><div class="schedule-bar-progress" style="width: ${progressPercent}%"></div></div>` : ""}
        <div class="task-card-footer">
            <div class="task-card-meta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${formatDate(p.projectEndDate || p.deadline || "")}
            </div>
            <div class="task-card-assignees">
                ${'<div class="assignee-avatar">?</div>'}
            </div>
        </div>
    `

  card.querySelector(".view-details-btn").addEventListener("click", (e) => {
    e.stopPropagation()
    openProjectDetailsModal(p.id)
  })
  return card
}

function getComplexityName(complexity) {
  const names = {
    low: "Низкая",
    medium: "Средняя",
    high: "Высокая",
    critical: "Критическая",
  }
  return names[complexity] || complexity
}

function formatDate(dateStr) {
  if (!dateStr) return "N/A"
  try {
    const d = new Date(dateStr)
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getFullYear()).slice(-2)}`
  } catch (e) {
    return dateStr
  }
}

// --- Project Creation Form ---
const projectFormEl = document.getElementById("projectForm")
projectFormEl.addEventListener("submit", async (e) => {
  e.preventDefault()

  const formData = {
    projectName: document.getElementById("projectNameForm").value,
    projectDescription: document.getElementById("projectDescriptionForm").value,
    projectStartDate: document.getElementById("projectStartDateForm").value,
    projectEndDate: document.getElementById("projectEndDateForm").value,
    estimatedCost: document.getElementById("projectCostForm").value || "0",
    estimatedHours: document.getElementById("projectHoursForm").value || null,
    status: document.getElementById("projectStatusForm").value,
    projectLink: document.getElementById("projectLinkForm").value,
  }

  loadingOverlay.style.display = "flex"

  try {
    let complexity = "medium"
    let estimatedCost = formData.estimatedCost

    if (formData.projectDescription) {
      const complexityResult = await analyzeComplexity(formData.projectDescription)
      complexity = complexityResult.complexity

      if (!formData.estimatedCost && formData.projectStartDate && formData.projectEndDate) {
        const costResult = await calculateCost(
          formData.projectDescription,
          complexity,
          formData.projectStartDate,
          formData.projectEndDate,
        )
        estimatedCost = costResult.estimatedCost
      }
    }

    const newProject = {
      id: Date.now(),
      ...formData,
      estimatedCost: estimatedCost,
      complexity: complexity,
      timestamp: new Date().toISOString(),
    }

    const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")
    projects.push(newProject)
    localStorage.setItem("projects_data", JSON.stringify(projects))

    projectFormEl.reset()
    document.getElementById("analysisResults").style.display = "none"
    updateComplexityDisplay("")

    const today = new Date().toISOString().split("T")[0]
    document.getElementById("projectStartDateForm").min = today
    document.getElementById("projectEndDateForm").min = today
    document.getElementById("projectStatusForm").value = "new"

    document.querySelector('.sidebar-menu button[data-section="projects"]').click()
  } catch (error) {
    console.error("Error creating project:", error)
    alert("Ошибка при создании проекта. Попробуйте еще раз.")
  } finally {
    loadingOverlay.style.display = "none"
  }
})

// --- Teams Section Logic ---
function loadTeamsData() {
  const teamsGrid = document.getElementById("teamsGridContainer")
  teamsGrid.innerHTML = ""
  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")

  const teamLoadData = {}
  Object.keys(TEAM_TYPES_CONFIG).forEach((key) => {
    teamLoadData[key] = { activeProjectsCount: 0, projectNames: [] }
  })

  projects.forEach((p) => {
    if (p.status === "in-progress" || p.status === "review") {
      const assignedTeamString = p.assignedTeam ? p.assignedTeam.toLowerCase() : ""
      let matchedToTeam = false

      Object.entries(TEAM_TYPES_CONFIG).forEach(([teamKey, teamConfig]) => {
        if (teamConfig.keywords.some((keyword) => assignedTeamString.includes(keyword))) {
          teamLoadData[teamKey].activeProjectsCount++
          teamLoadData[teamKey].projectNames.push(p.projectName)
          matchedToTeam = true
        }
      })

      if (!matchedToTeam && assignedTeamString) {
        teamLoadData.Other.activeProjectsCount++
        teamLoadData.Other.projectNames.push(p.projectName)
      }
    }
  })

  let maxProjectsForOneType = 0
  Object.values(teamLoadData).forEach((data) => {
    if (data.activeProjectsCount > maxProjectsForOneType) {
      maxProjectsForOneType = data.activeProjectsCount
    }
  })
  maxProjectsForOneType = Math.max(1, maxProjectsForOneType)

  Object.entries(TEAM_TYPES_CONFIG).forEach(([teamKey, teamConfig]) => {
    const loadInfo = teamLoadData[teamKey]
    const loadPercent = (loadInfo.activeProjectsCount / maxProjectsForOneType) * 100

    let barClass = "low"
    if (loadPercent > 75) barClass = "critical"
    else if (loadPercent > 50) barClass = "high"
    else if (loadPercent > 25) barClass = "medium"

    const teamCard = document.createElement("div")
    teamCard.className = "team-info-card"

    let projectsListHtml = ""
    if (loadInfo.projectNames.length > 0) {
      projectsListHtml =
        `<ul class="team-active-projects-list">` +
        loadInfo.projectNames.map((name) => `<li>${name}</li>`).join("") +
        `</ul>`
    } else {
      projectsListHtml = `<p style="font-style: italic; color: var(--gray-500);">Нет активных проектов</p>`
    }

    teamCard.innerHTML = `
            <div class="team-info-card-header">
                <div class="team-info-icon">${teamConfig.icon}</div>
                <div class="team-info-name">${teamConfig.name}</div>
            </div>
            <div class="team-load-details">
                <p>Активных проектов: <strong>${loadInfo.activeProjectsCount}</strong></p>
                ${projectsListHtml}
            </div>
            <div class="team-load-bar-container">
                <div class="team-load-bar ${barClass}" style="width: ${loadInfo.activeProjectsCount > 0 ? Math.max(5, loadPercent) : 0}%">
                   ${loadInfo.activeProjectsCount > 0 ? loadInfo.activeProjectsCount : ""}
                </div>
            </div>
        `
    teamsGrid.appendChild(teamCard)
  })

  renderGanttChart()
  renderWorkloadChart()
}

// --- Gantt Chart and Workload Chart ---
function renderGanttChart() {
  const ganttChart = document.getElementById("ganttChart")
  if (!ganttChart) return

  ganttChart.innerHTML = ""

  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")
  const today = new Date()
  const startBoundary = new Date(today)
  startBoundary.setDate(today.getDate() - 30)
  const endBoundary = new Date(today)
  endBoundary.setDate(today.getDate() + 60)

  const totalDays = (endBoundary - startBoundary) / (1000 * 60 * 60 * 24)
  const pixelsPerDay = 5

  projects.forEach((project) => {
    if (!project.projectStartDate || !project.projectEndDate) return

    const startDate = new Date(project.projectStartDate)
    const endDate = new Date(project.projectEndDate)

    if (startDate >= endBoundary || endDate <= startBoundary) return

    const startOffset = Math.max(0, (startDate - startBoundary) / (1000 * 60 * 60 * 24))
    const duration = (endDate - startDate) / (1000 * 60 * 60 * 24)
    const left = startOffset * pixelsPerDay
    const width = Math.max(5, duration * pixelsPerDay)

    const taskBar = document.createElement("div")
    taskBar.style.position = "absolute"
    taskBar.style.left = `${left}px`
    taskBar.style.width = `${width}px`
    taskBar.style.height = "20px"
    taskBar.style.backgroundColor = "#007bff"
    taskBar.style.marginTop = "10px"
    taskBar.style.borderRadius = "2px"
    taskBar.title = `${project.projectName}: ${project.projectStartDate} - ${project.projectEndDate}`
    ganttChart.appendChild(taskBar)
  })

  ganttChart.style.width = `${totalDays * pixelsPerDay}px`
}

function renderWorkloadChart() {
  const ctx = document.getElementById("workloadChart").getContext("2d")
  if (!ctx) return

  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")
  const teamLoadData = {}

  Object.keys(TEAM_TYPES_CONFIG).forEach((key) => {
    teamLoadData[key] = { activeProjectsCount: 0 }
  })

  projects.forEach((p) => {
    if (p.status === "in-progress" || p.status === "review") {
      const assignedTeamString = p.assignedTeam ? p.assignedTeam.toLowerCase() : ""
      let matchedToTeam = false

      Object.entries(TEAM_TYPES_CONFIG).forEach(([teamKey, teamConfig]) => {
        if (teamConfig.keywords.some((keyword) => assignedTeamString.includes(keyword))) {
          teamLoadData[teamKey].activeProjectsCount++
          matchedToTeam = true
        }
      })

      if (!matchedToTeam && assignedTeamString) {
        teamLoadData.Other.activeProjectsCount++
      }
    }
  })

  const teams = Object.entries(teamLoadData)
    .filter(([_, data]) => data.activeProjectsCount > 0)
    .map(([teamKey, data]) => ({
      name: TEAM_TYPES_CONFIG[teamKey].name,
      load: data.activeProjectsCount * 20,
    }))

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: teams.map((team) => team.name),
      datasets: [
        {
          label: "Нагрузка (%)",
          data: teams.map((team) => Math.min(team.load, 100)),
          backgroundColor: "#007bff",
          borderColor: "#0056b3",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  })
}

// --- Project Details Modal Logic ---
function openProjectDetailsModal(projectId) {
  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")
  const project = projects.find((p) => p.id === projectId)
  if (project) {
    currentEditingProjectId = projectId
    populateModalDetails(project, false)
    projectDetailsModal.classList.add("active")
  }
}

function populateModalDetails(project, isEditMode) {
  modalProjectName.textContent = project.projectName
  let detailsHtml = ""

  const fields = [
    { label: "Описание", key: "projectDescription", type: "textarea" },
    { label: "Дата начала", key: "projectStartDate", type: "date" },
    { label: "Дата завершения", key: "projectEndDate", type: "date" },
    { label: "Стоимость (₽)", key: "estimatedCost", type: "number" },
    { label: "Оценочные часы", key: "estimatedHours", type: "number" },
    {
      label: "Сложность",
      key: "complexity",
      type: "select",
      options: { low: "Низкая", medium: "Средняя", high: "Высокая", critical: "Критическая" },
    },
    { label: "Статус", key: "status", type: "select", options: KANBAN_COLUMNS_CONFIG },
    { label: "Ссылка", key: "projectLink", type: "url" },
  ]

  if (isEditMode) {
    fields.forEach((field) => {
      detailsHtml += `<div class="modal-detail-item"><strong>${field.label}:</strong>`
      if (field.type === "textarea") {
        detailsHtml += `<textarea id="modal_${field.key}">${project[field.key] || ""}</textarea>`
      } else if (field.type === "select") {
        detailsHtml += `<select id="modal_${field.key}">`
        Object.keys(field.options).forEach((optKey) => {
          const optValue = field.options[optKey].title || field.options[optKey]
          detailsHtml += `<option value="${optKey}" ${project[field.key] === optKey ? "selected" : ""}>${optValue}</option>`
        })
        detailsHtml += `</select>`
      } else {
        detailsHtml += `<input type="${field.type}" id="modal_${field.key}" value="${project[field.key] || ""}">`
      }
      detailsHtml += `</div>`
    })
  } else {
    detailsHtml = `
            <div class="modal-detail-item"><strong>Описание:</strong> <span>${project.projectDescription || "Нет"}</span></div>
            <div class="modal-detail-item"><strong>Даты:</strong> <span>${formatDate(project.projectStartDate)} - ${formatDate(project.projectEndDate)}</span></div>
            <div class="modal-detail-item"><strong>Стоимость:</strong> <span>${project.estimatedCost ? Number.parseFloat(project.estimatedCost).toLocaleString("ru-RU") + " ₽" : "Не указана"}</span></div>
            <div class="modal-detail-item"><strong>Оценочные часы:</strong> <span>${project.estimatedHours || "Не указаны"}</span></div>
            <div class="modal-detail-item"><strong>Сложность:</strong> <span class="complexity-level complexity-${project.complexity || "medium"}">${getComplexityName(project.complexity || "medium")}</span></div>
            <div class="modal-detail-item"><strong>Статус:</strong> <span>${KANBAN_COLUMNS_CONFIG[project.status]?.title || project.status}</span></div>
            <div class="modal-detail-item"><strong>Ссылка:</strong> <span>${project.projectLink ? `<a href="${project.projectLink}" target="_blank">${project.projectLink}</a>` : "Нет"}</span></div>
        `
  }
  modalBodyContent.innerHTML = detailsHtml
}

function enterEditMode() {
  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")
  const project = projects.find((p) => p.id === currentEditingProjectId)
  if (project) populateModalDetails(project, true)

  editProjectBtn.style.display = "none"
  saveChangesBtn.style.display = "inline-block"
  cancelEditBtn.style.display = "inline-block"
}

function exitEditMode() {
  editProjectBtn.style.display = "inline-block"
  saveChangesBtn.style.display = "none"
  cancelEditBtn.style.display = "none"
}

function saveProjectChanges() {
  const projects = JSON.parse(localStorage.getItem("projects_data") || "[]")
  const projectIndex = projects.findIndex((p) => p.id === currentEditingProjectId)
  if (projectIndex !== -1) {
    projects[projectIndex].projectDescription = document.getElementById("modal_projectDescription").value
    projects[projectIndex].projectStartDate = document.getElementById("modal_projectStartDate").value
    projects[projectIndex].projectEndDate = document.getElementById("modal_projectEndDate").value
    projects[projectIndex].estimatedCost = document.getElementById("modal_estimatedCost").value || projects[projectIndex].estimatedCost
    projects[projectIndex].estimatedHours = document.getElementById("modal_estimatedHours").value || projects[projectIndex].estimatedHours
    projects[projectIndex].complexity = document.getElementById("modal_complexity").value
    projects[projectIndex].status = document.getElementById("modal_status").value
    projects[projectIndex].projectLink = document.getElementById("modal_projectLink").value

    localStorage.setItem("projects_data", JSON.stringify(projects))
    exitEditMode()
    populateModalDetails(projects[projectIndex], false)
    loadProjectsBoard()
    loadTeamsData()
  }
}

// --- Initial Demo Data ---
if (!localStorage.getItem("projects_data")) {
  localStorage.setItem(
    "projects_data",
    JSON.stringify([
      {
        id: 1,
        projectName: "Обновление корпоративного портала",
        projectDescription: "Перенос на новый CMS, редизайн, добавление модуля новостей.",
        projectStartDate: "2025-06-01",
        projectEndDate: "2025-08-30",
        status: "in-progress",
        estimatedCost: "250000",
        estimatedHours: null,
        complexity: "high",
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        projectName: "Мобильное приложение 'Курьер Плюс'",
        projectDescription: "Разработка iOS и Android приложения для службы доставки.",
        projectStartDate: "2025-07-15",
        projectEndDate: "2025-11-30",
        status: "new",
        estimatedCost: "400000",
        estimatedHours: null,
        complexity: "critical",
        timestamp: new Date().toISOString(),
      },
      {
        id: 3,
        projectName: "CRM для отдела продаж",
        projectDescription: "Автоматизация учета клиентов и сделок.",
        projectStartDate: "2025-05-20",
        projectEndDate: "2025-07-20",
        status: "completed",
        estimatedCost: "180000",
        estimatedHours: null,
        complexity: "medium",
        timestamp: new Date().toISOString(),
      },
      {
        id: 4,
        projectName: "AI Чат-бот поддержки",
        projectDescription: "Создание интеллектуального чат-бота для сайта.",
        projectStartDate: "2025-08-01",
        projectEndDate: "2025-09-15",
        status: "review",
        estimatedCost: "120000",
        estimatedHours: null,
        complexity: "medium",
        timestamp: new Date().toISOString(),
      },
    ]),
  )
}
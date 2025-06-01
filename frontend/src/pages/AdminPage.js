// AdminPage.js

// 1. Встраиваем CSS из admin.css
const adminCss = `
:root {
  --primary-gray: #6b7280;
  --primary-gray-dark: #4b5563;
  --primary-gray-light: #f3f4f6;
  --secondary-gray: #9ca3af;
  --text-dark: #111827;
  --text-medium: #6b7280;
  --text-light: #9ca3af;
  --bg-main: #f9fafb;
  --bg-card: #ffffff;
  --bg-teams-section: #fdfdfd;
  --border-color: #e5e7eb;
  --border-color-light: #f3f4f6;
  --column-bg: #f9fafb;
  --shadow-soft: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.1);
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --blue-50: #eff6ff;
  --blue-100: #dbeafe;
  --blue-200: #bfdbfe;
  --blue-600: #2563eb;
  --blue-700: #1d4ed8;
  --green-100: #d1fae5;
  --green-600: #059669;
  --green-700: #047857;
  --red-100: #fee2e2;
  --red-600: #dc2626;
  --red-700: #b91c1c;
  --yellow-100: #fef3c7;
  --yellow-600: #d97706;
  --yellow-700: #b45309;
  --orange-100: #ffedd5;
  --orange-600: #ea580c;
  --orange-700: #c2410c;
  --purple-100: #ede9fe;
  --purple-600: #7c3aed;
  --purple-700: #6d28d9;
}

/* Dark Theme Variables */
body.dark-theme {
  --text-dark: #f3f4f6;
  --text-medium: #d1d5db;
  --text-light: #9ca3af;
  --bg-main: #1f2937;
  --bg-card: #374151;
  --bg-teams-section: #4b5563;
  --border-color: #4b5563;
  --border-color-light: #374151;
  --column-bg: #4b5563;
  --gray-50: #374151;
  --gray-100: #4b5563;
  --gray-200: #6b7280;
  --gray-300: #9ca3af;
}


/* Base */
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  background-color: var(--bg-main);
  color: var(--text-dark);
  line-height: 1.5;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*, *::before, *::after {
  box-sizing: border-box;
}

a {
  text-decoration: none;
  color: inherit;
}

button, input, select, textarea {
  font-family: 'Inter', sans-serif;
  outline: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 1rem;
  background-color: var(--bg-card);
  color: var(--text-dark);
  transition: border-color 0.2s, box-shadow 0.2s;
}

button:hover, input:hover, select:hover, textarea:hover {
  border-color: var(--blue-200);
}

button:focus, input:focus, select:focus, textarea:focus {
  border-color: var(--blue-600);
  box-shadow: 0 0 0 3px var(--blue-100);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
  white-space: nowrap;
}

.btn-primary {
  background-color: var(--blue-600);
  color: #fff;
  border-color: var(--blue-600);
}

.btn-primary:hover {
  background-color: var(--blue-700);
  border-color: var(--blue-700);
}

.btn-secondary {
  background-color: var(--gray-200);
  color: var(--text-dark);
  border-color: var(--gray-200);
}

.btn-secondary:hover {
  background-color: var(--gray-300);
  border-color: var(--gray-300);
}

.btn-edit {
  background-color: var(--blue-100);
  color: var(--blue-700);
  border-color: var(--blue-100);
}

.btn-edit:hover {
  background-color: var(--blue-200);
  border-color: var(--blue-200);
}

.btn-save {
  background-color: var(--green-600);
  color: #fff;
  border-color: var(--green-600);
}

.btn-save:hover {
  background-color: var(--green-700);
  border-color: var(--green-700);
}

.btn-cancel {
  background-color: var(--red-100);
  color: var(--red-700);
  border-color: var(--red-100);
}

.btn-cancel:hover {
  background-color: var(--red-200);
  border-color: var(--red-200);
}


/* Login Form */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--gray-50);
}

.login-form {
  background-color: var(--bg-card);
  padding: 40px;
  border-radius: 12px;
  box-shadow: var(--shadow-medium);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid var(--border-color);
}

.login-form h2 {
  margin-bottom: 30px;
  color: var(--text-dark);
  font-size: 1.8rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-medium);
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-dark);
  background-color: var(--gray-50);
  transition: border-color 0.2s, background-color 0.2s;
}

.form-control:focus {
  border-color: var(--blue-600);
  background-color: #fff;
  box-shadow: 0 0 0 3px var(--blue-100);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--blue-600);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: var(--blue-700);
}

.login-info {
  margin-top: 25px;
  font-size: 0.9rem;
  color: var(--text-medium);
  text-align: left;
}

.login-info ul {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.login-info li {
  margin-bottom: 5px;
}

/* Admin Dashboard Layout */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-main);
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: var(--bg-card);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: var(--shadow-soft);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  margin-bottom: 30px;
}

.sidebar-header .logo {
  height: 36px;
  width: 36px;
  object-fit: contain;
}

.sidebar-header .logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-dark);
  letter-spacing: -0.025em;
}

.sidebar-nav {
  flex-grow: 1;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 10px;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: 8px;
  color: var(--text-medium);
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.sidebar-nav a:hover {
  background-color: var(--gray-100);
  color: var(--text-dark);
}

.sidebar-nav a.active {
  background-color: var(--blue-100);
  color: var(--blue-700);
}

.sidebar-nav .nav-icon {
  margin-right: 12px;
  font-size: 1.25rem;
}

.sidebar-footer {
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.logout-btn {
  width: 100%;
  background-color: var(--red-600);
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: var(--red-700);
}

/* Main Content */
.main-content {
  flex-grow: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  background-color: var(--bg-card);
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--border-color);
}

.main-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-weight: 600;
  color: var(--text-dark);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--blue-600);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Kanban Board */
.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.kanban-column {
  background-color: var(--column-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  min-height: 400px; /* Ensures columns have some height */
}

.kanban-column h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-dark);
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color-light);
}

.kanban-tasks {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-right: 5px; /* For scrollbar */
  overflow-y: auto;
}

.kanban-task {
  background-color: var(--bg-card);
  padding: 15px;
  border-radius: 10px;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--border-color);
  cursor: grab;
  transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out;
}

.kanban-task:active {
  cursor: grabbing;
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.kanban-task.dragging {
  opacity: 0.5;
  transform: scale(0.98);
}

.kanban-task h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0 0 10px 0;
}

.kanban-task p {
  font-size: 0.9rem;
  color: var(--text-medium);
  margin: 0 0 10px 0;
}

.task-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-light);
}

.task-tags {
  display: flex;
  gap: 5px;
}

.task-tag {
  background-color: var(--gray-100);
  color: var(--gray-600);
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 0.75rem;
}

/* Project Analysis Section */
.project-analysis-section, .create-project-section {
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 30px;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--border-color);
}

.project-analysis-section h2, .create-project-section h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-top: 0;
  margin-bottom: 25px;
}

.analysis-form .form-group, .create-project-form .form-group {
  margin-bottom: 25px;
}

.analysis-form textarea, .create-project-form textarea {
  min-height: 120px;
  resize: vertical;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--text-medium);
  font-weight: 400;
}

.checkbox-group input[type="checkbox"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
  flex-shrink: 0;
}

.checkbox-group input[type="checkbox"]:checked {
  background-color: var(--blue-600);
  border-color: var(--blue-600);
}

.checkbox-group input[type="checkbox"]:checked::after {
  content: '✔';
  color: #fff;
  font-size: 14px;
}

.analysis-results {
  margin-top: 30px;
  background-color: var(--gray-50);
  padding: 20px;
  border-radius: 10px;
  border: 1px dashed var(--border-color);
  display: none; /* Hidden by default */
}

.analysis-content .analysis-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed var(--gray-200);
}

.analysis-content .analysis-item:last-child {
  border-bottom: none;
}

.analysis-content .analysis-item strong {
  color: var(--text-dark);
}

.analysis-content .analysis-item span {
  color: var(--text-medium);
  font-weight: 500;
}

.complexity-low { color: var(--green-600); font-weight: 600; }
.complexity-medium { color: var(--yellow-600); font-weight: 600; }
.complexity-high { color: var(--orange-600); font-weight: 600; }
.complexity-critical { color: var(--red-600); font-weight: 600; }

/* Modal */
.details-modal {
  display: none; /* Hidden by default */
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: var(--bg-card);
  margin: auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: var(--shadow-medium);
  width: 90%;
  max-width: 600px;
  position: relative;
  border: 1px solid var(--border-color);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border-color-light);
  padding-bottom: 15px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--text-dark);
  font-weight: 700;
}

.close-modal-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--text-light);
  cursor: pointer;
  transition: color 0.2s;
  padding: 0;
}

.close-modal-btn:hover {
  color: var(--text-dark);
}

.modal-body {
  margin-bottom: 25px;
}

.modal-body p {
  margin-bottom: 10px;
  color: var(--text-medium);
}

.modal-body strong {
  color: var(--text-dark);
}

.modal-body .detail-item {
  margin-bottom: 10px;
}

.modal-body .detail-item label {
  display: block;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 5px;
}

.modal-body .detail-item input[type="text"],
.modal-body .detail-item textarea,
.modal-body .detail-item select,
.modal-body .detail-item input[type="number"],
.modal-body .detail-item input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--gray-50);
  color: var(--text-dark);
}

.modal-body .detail-item textarea {
  min-height: 100px;
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color-light);
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.loading-spinner {
  text-align: center;
  padding: 30px;
  background-color: var(--bg-card);
  border-radius: 12px;
  box-shadow: var(--shadow-medium);
  border: 1px solid var(--border-color);
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border-left-color: var(--blue-600);
  animation: spin 1s ease infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: var(--text-dark);
  font-size: 1.1rem;
  font-weight: 500;
}

/* Scrollbar styles */
.kanban-tasks::-webkit-scrollbar,
.content-area::-webkit-scrollbar,
.team-active-projects-list::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.kanban-tasks::-webkit-scrollbar-track,
.content-area::-webkit-scrollbar-track,
.team-active-projects-list::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 10px;
}

.kanban-tasks::-webkit-scrollbar-thumb,
.content-area::-webkit-scrollbar-thumb,
.team-active-projects-list::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: 10px;
}

.kanban-tasks::-webkit-scrollbar-thumb:hover,
.content-area::-webkit-scrollbar-thumb:hover,
.team-active-projects-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-light);
}

/* Добавляем стили для результатов поиска */
.search-results-container {
  width: 100%;
  background-color: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-soft);
  border: 1px solid var(--border-color);
}

.search-results-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.search-results-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin-right: auto;
}

.search-count {
  color: var(--text-medium);
  font-size: 14px;
  background-color: var(--gray-100);
  padding: 4px 10px;
  border-radius: 16px;
}

.clear-search-btn {
  background-color: var(--gray-200);
  color: var(--text-dark);
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.clear-search-btn:hover {
  background-color: var(--gray-300);
}

.search-results-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-result-item {
  background-color: var(--gray-50);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid var(--border-color-light);
}

.search-result-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-dark);
  margin-bottom: 8px;
}

.search-result-item p {
  font-size: 14px;
  color: var(--text-medium);
  line-height: 1.4;
}

.search-result-item .meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-light);
  margin-top: 10px;
}

.search-result-item .meta span:first-child {
  font-weight: 500;
}

.highlight {
  background-color: #fff9c4; /* Light yellow highlight */
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}

/* Teams Section Specific Styles */
.teams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.team-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 20px;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border-color);
}

.team-card h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--text-dark);
}

.team-member-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.team-member-list li {
    padding: 8px 0;
    border-bottom: 1px dashed var(--border-color-light);
    color: var(--text-medium);
}

.team-member-list li:last-child {
    border-bottom: none;
}

.team-member-list li strong {
    color: var(--text-dark);
}

.team-projects-list {
    margin-top: 15px;
    border-top: 1px solid var(--border-color-light);
    padding-top: 15px;
}

.team-projects-list h4 {
    font-size: 1.1rem;
    color: var(--text-dark);
    margin-bottom: 10px;
}

.team-projects-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.team-projects-list li {
    background-color: var(--gray-50);
    padding: 10px 15px;
    border-radius: 8px;
    margin-bottom: 8px;
    border: 1px solid var(--border-color-light);
    font-size: 0.95rem;
    color: var(--text-medium);
}

.team-projects-list li strong {
    color: var(--text-dark);
}

/* Settings Theme Toggle */
.theme-toggle-group {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.theme-toggle-group label {
    font-weight: 600;
    color: var(--text-dark);
}

.theme-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

.theme-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--gray-400);
    transition: .4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--blue-600);
}

input:focus + .slider {
    box-shadow: 0 0 1px var(--blue-600);
}

input:checked + .slider:before {
    transform: translateX(26px);
}

/* Reports Section */
.charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
}

.chart-card {
    background-color: var(--bg-card);
    border-radius: 12px;
    padding: 20px;
    box-shadow: var(--shadow-soft);
    border: 1px solid var(--border-color);
}

.chart-card h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 15px;
    color: var(--text-dark);
    text-align: center;
}

.chart-container {
    position: relative;
    height: 300px; /* Fixed height for consistency */
    width: 100%;
}

`;

// 2. Встраиваем HTML из admin.html
const adminHtmlContent = `
    <div id="loginContainer" class="login-container">
        <form class="login-form" id="loginForm">
            <h2>Вход в систему</h2>
            <div class="form-group">
                <label for="username">Логин</label>
                <input type="text" id="username" class="form-control" required value="admin">
            </div>
            <div class="form-group">
                <label for="password">Пароль</label>
                <input type="password" id="password" class="form-control" required value="admin">
            </div>
            <button type="submit" class="login-btn">Войти</button>
            <div class="login-info">
                <strong>Тестовые аккаунты:</strong>
                <ul>
                    <li>admin/admin</li>
                    <li>root/root</li>
                    <li>user/user</li>
                </ul>
            </div>
        </form>
    </div>

    <div id="adminDashboard" class="admin-dashboard" style="display: none;">
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="/devrequest-logo.png" alt="DevRequest Logo" class="logo">
                <span class="logo-text">DevRequest</span>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="#" class="active" data-content-id="projects"><i class="fas fa-folder nav-icon"></i> Проекты</a></li>
                    <li><a href="#" data-content-id="teams"><i class="fas fa-users nav-icon"></i> Команды</a></li>
                    <li><a href="#" data-content-id="reports"><i class="fas fa-chart-bar nav-icon"></i> Отчеты</a></li>
                    <li><a href="#" data-content-id="settings"><i class="fas fa-cog nav-icon"></i> Настройки</a></li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <button class="logout-btn">Выход</button>
            </div>
        </aside>

        <main class="main-content">
            <header class="main-header">
                <div class="header-left">
                    <h1 id="mainContentHeader">Панель администратора</h1>
                </div>
                <div class="header-right">
                    <div class="user-profile">
                        <span id="currentUserName" class="user-name">Гость</span>
                        <div class="user-avatar" id="userAvatarInitial">G</div>
                    </div>
                </div>
            </header>

            <section class="content-area" id="projectsContent">
                <div class="kanban-board">
                    <div class="kanban-column" id="newTasksColumn" data-status="new">
                        <h3>Новые задачи</h3>
                        <div class="kanban-tasks">
                            </div>
                    </div>
                    <div class="kanban-column" id="inProgressTasksColumn" data-status="in-progress">
                        <h3>В работе</h3>
                        <div class="kanban-tasks"></div>
                    </div>
                    <div class="kanban-column" id="completedTasksColumn" data-status="completed">
                        <h3>Завершенные</h3>
                        <div class="kanban-tasks"></div>
                    </div>
                </div>

                <div class="project-analysis-section">
                    <h2>Анализ нового проекта</h2>
                    <form id="projectAnalysisForm" class="analysis-form">
                        <div class="form-group">
                            <label for="projectDescription">Описание проекта</label>
                            <textarea id="projectDescription" placeholder="Подробное описание проекта, его функционала и требований..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="projectTeam">Предполагаемая команда</label>
                            <select id="projectTeam">
                                <option value="">Выберите команду</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="mobile">Mobile</option>
                                <option value="devops">DevOps</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Технологии (выберите несколько)</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" name="technologies" value="react"> React</label>
                                <label><input type="checkbox" name="technologies" value="angular"> Angular</label>
                                <label><input type="checkbox" name="technologies" value="vue"> Vue</label>
                                <label><input type="checkbox" name="technologies" value="nodejs"> Node.js</label>
                                <label><input type="checkbox" name="technologies" value="python"> Python</label>
                                <label><input type="checkbox" name="technologies" value="java"> Java</label>
                                <label><input type="checkbox" name="technologies" value="golang"> Golang</label>
                                <label><input type="checkbox" name="technologies" value="aws"> AWS</label>
                                <label><input type="checkbox" name="technologies" value="azure"> Azure</label>
                                <label><input type="checkbox" name="technologies" value="docker"> Docker</label>
                                <label><input type="checkbox" name="technologies" value="kubernetes"> Kubernetes</label>
                                <label><input type="checkbox" name="blockchain"> Blockchain</label>
                                <label><input type="checkbox" name="ai"> AI/ML</label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="projectUrgency">Срочность</label>
                            <select id="projectUrgency">
                                <option value="normal">Нормальная</option>
                                <option value="urgent">Срочная</option>
                                <option value="critical">Критическая</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Анализировать проект</button>
                        <button type="button" class="btn btn-secondary" id="addProjectToKanban">Добавить проект на Kanban</button>
                        <div id="analysisResults" class="analysis-results">
                            <div class="analysis-content"></div>
                        </div>
                    </form>
                </div>

                <div class="create-project-section">
                    <h2>Создать новый проект</h2>
                    <form id="createProjectForm" class="create-project-form">
                        <div class="form-group">
                            <label for="createProjectName">Название проекта</label>
                            <input type="text" id="createProjectName" class="form-control" placeholder="Введите название проекта" required>
                        </div>
                        <div class="form-group">
                            <label for="createProjectDescription">Описание проекта</label>
                            <textarea id="createProjectDescription" class="form-control" placeholder="Подробное описание проекта..."></textarea>
                        </div>
                         <div class="form-group">
                            <label for="createProjectTeam">Команда</label>
                            <select id="createProjectTeam" class="form-control">
                                <option value="">Выберите команду</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="mobile">Mobile</option>
                                <option value="devops">DevOps</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="createProjectStartDate">Дата начала</label>
                            <input type="date" id="createProjectStartDate" class="form-control">
                        </div>
                        <div class="form-group">
                            <label for="createProjectEndDate">Предполагаемая дата завершения</label>
                            <input type="date" id="createProjectEndDate" class="form-control">
                        </div>
                        <button type="submit" class="btn btn-primary">Добавить проект</button>
                    </form>
                </div>
            </section>

            <section class="content-area" id="teamsContent" style="display:none;">
                <h2>Команды</h2>
                <div class="teams-grid" id="teamsGrid">
                    </div>
            </section>

            <section class="content-area" id="reportsContent" style="display:none;">
                <h2>Отчеты</h2>
                <div class="charts-grid">
                    <div class="chart-card">
                        <h3>Загруженность команд</h3>
                        <div class="chart-container">
                            <canvas id="teamWorkloadChart"></canvas>
                        </div>
                    </div>
                    <div class="chart-card">
                        <h3>Статус выполнения проектов</h3>
                        <div class="chart-container">
                            <canvas id="projectCompletionChart"></canvas>
                        </div>
                    </div>
                </div>
            </section>
            <section class="content-area" id="settingsContent" style="display:none;">
                <h2>Настройки</h2>
                <div class="theme-toggle-group">
                    <label for="themeSwitch">Темная тема</label>
                    <label class="theme-switch">
                        <input type="checkbox" id="themeSwitch">
                        <span class="slider"></span>
                    </label>
                </div>
                <p>Здесь будут другие настройки административной панели.</p>
            </section>

        </main>
    </div>

    <div id="projectDetailsModal" class="details-modal" style="display:none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalProjectName">Детали проекта</h2>
                <button class="close-modal-btn" id="closeModalBtn">×</button>
            </div>
            <div class="modal-body" id="modalBodyContent">
                </div>
            <div class="modal-footer">
                <button class="btn btn-edit" id="editProjectBtn">Редактировать</button>
                <button class="btn btn-cancel" id="cancelEditBtn" style="display:none;">Отмена</button>
                <button class="btn btn-save" id="saveChangesBtn" style="display:none;">Сохранить изменения</button>
            </div>
        </div>
    </div>

    <div id="loadingOverlay" class="loading-overlay" style="display: none;">
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Анализируем проект...</p>
        </div>
    </div>
`;

// 3. Встраиваем логику из admin.js
// --- User Auth, Global Vars ---
const users = {
  admin: { password: "admin", name: "Администратор" },
  root: { password: "root", name: "Root Admin" },
  user: { password: "user", name: "Пользователь" },
}

let currentLoggedInUser = null
let draggedTask = null
let currentEditingProjectId = null
let latestAnalysisResult = null; // Для хранения последнего результата анализа

// --- Projects Data ---
// (В реальном приложении это будет загружаться с сервера)
let projects = [
  {
    id: "proj1",
    name: "Разработка мобильного приложения для доставки еды",
    description: "Нативное мобильное приложение для iOS и Android, включающее функции заказа, оплаты, отслеживания курьера и программу лояльности. Необходимо интегрироваться с существующей системой управления ресторанами и платежными шлюзами. Предполагается использование React Native.",
    status: "new",
    team: "mobile",
    technologies: ["react-native", "node.js", "mongodb", "firebase"],
    complexity: "high",
    estimatedCost: 250000,
    creationDate: "2024-03-10",
    lastUpdate: "2024-03-15",
    urgency: "normal",
    startDate: "2024-03-10",
    endDate: "2024-08-30",
    assignedTo: ["Иванов И.", "Петрова А."] // Added for teams section
  },
  {
    id: "proj2",
    name: "Создание корпоративного веб-сайта",
    description: "Разработка адаптивного корпоративного веб-сайта с разделами: о нас, услуги, портфолио, контакты и блог. Включает разработку уникального дизайна и SEO-оптимизацию. CMS WordPress.",
    status: "in-progress",
    team: "frontend",
    technologies: ["wordpress", "php", "mysql", "html", "css", "javascript"],
    complexity: "medium",
    estimatedCost: 80000,
    creationDate: "2024-02-20",
    lastUpdate: "2024-03-28",
    urgency: "normal",
    startDate: "2024-02-20",
    endDate: "2024-06-15",
    assignedTo: ["Сидоров С.", "Ковалева В."] // Added for teams section
  },
  {
    id: "proj3",
    name: "Внедрение CRM системы",
    description: "Кастомизация и внедрение Bitrix24 для отдела продаж. Включает настройку воронок продаж, интеграцию с телефонией и электронной почтой, обучение персонала. Требуется значительная доработка под специфические процессы клиента.",
    status: "completed",
    team: "backend",
    technologies: ["bitrix24", "php", "api-integration"],
    complexity: "critical",
    estimatedCost: 150000,
    creationDate: "2023-11-01",
    lastUpdate: "2024-03-05",
    urgency: "urgent",
    startDate: "2023-11-01",
    endDate: "2024-03-01",
    assignedTo: ["Смирнов Д."] // Added for teams section
  },
  {
    id: "proj4",
    name: "Разработка системы онлайн-бронирования",
    description: "Разработка веб-приложения для бронирования услуг (например, аренда авто, запись к врачу) с календарём доступности, системой уведомлений и онлайн-оплатой. Требуется высокая производительность и безопасность.",
    status: "new",
    team: "backend",
    technologies: ["python", "django", "postgresql", "aws", "stripe-api"],
    complexity: "high",
    estimatedCost: 180000,
    creationDate: "2024-04-01",
    lastUpdate: "2024-04-01",
    urgency: "urgent",
    startDate: "2024-04-01",
    endDate: "2024-09-30",
    assignedTo: ["Волков М.", "Григорьева О."] // Added for teams section
  },
  {
    id: "proj5",
    name: "Обновление инфраструктуры DevSecOps",
    description: "Модернизация CI/CD пайплайнов, внедрение инструментов статического и динамического анализа кода, улучшение мониторинга и логирования. Цель - повышение безопасности и стабильности развертываний.",
    status: "in-progress",
    team: "devops",
    technologies: ["docker", "kubernetes", "jenkins", "terraform", "aws", "elk"],
    complexity: "critical",
    estimatedCost: 200000,
    creationDate: "2024-03-15",
    lastUpdate: "2024-04-10",
    urgency: "critical",
    startDate: "2024-03-15",
    endDate: "2024-10-01",
    assignedTo: ["Кузнецов В."] // Added for teams section
  },
];

// Teams data for the Teams section
const teams = {
    frontend: {
        name: "Frontend",
        members: ["Иванов И.", "Петрова А.", "Сидоров С.", "Ковалева В."],
        description: "Разработка пользовательских интерфейсов и клиентской части приложений."
    },
    backend: {
        name: "Backend",
        members: ["Смирнов Д.", "Волков М.", "Григорьева О."],
        description: "Разработка серверной логики, баз данных и API."
    },
    mobile: {
        name: "Mobile",
        members: ["Новиков П.", "Федорова Е."],
        description: "Разработка нативных и кроссплатформенных мобильных приложений."
    },
    devops: {
        name: "DevOps",
        members: ["Кузнецов В.", "Зайцев И."],
        description: "Управление инфраструктурой, автоматизация развертывания и мониторинга."
    }
    // Add more teams as needed
};


// Chart instances to destroy and recreate
let teamWorkloadChartInstance = null;
let projectCompletionChartInstance = null;

// --- API Functions ---
async function analyzeComplexity(description, team, technologies = [], urgency = "normal") {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const COMPLEXITY_KEYWORDS = {
      critical: [
        "ai",
        "artificial intelligence",
        "blockchain",
        "machine learning",
        "big data",
        "высоконагруженная",
        "распределенная система",
        "криптография",
        "нейронные сети",
        "real-time",
        "low-latency",
        "микросервисы",
      ],
      high: [
        "integrations",
        "API",
        "security",
        "payment gateway",
        "custom design",
        "data migration",
        "сложная логика",
        "многопользовательская",
        "масштабируемость",
        "высокая нагрузка",
        "оптимизация производительности",
      ],
      medium: [
        "database",
        "authentication",
        "user management",
        "reporting",
        "CRUD",
        "админ-панель",
        "базовая аналитика",
        "интеграция сторонних сервисов",
      ],
      low: [
        "landing page",
        "simple form",
        "static content",
        "блог",
        "сайт-визитка",
        "простой интерфейс",
        "готовый шаблон",
      ],
    }

    const BASE_COSTS = {
      frontend: { low: 20000, medium: 50000, high: 100000, critical: 150000 },
      backend: { low: 30000, medium: 70000, high: 120000, critical: 180000 },
      mobile: { low: 40000, medium: 80000, high: 150000, critical: 250000 },
      devops: { low: 25000, medium: 60000, high: 110000, critical: 200000 },
    }

    const HOURLY_RATES = {
      frontend: 500, // ₽/час
      backend: 600,
      mobile: 700,
      devops: 650,
    }

    const URGENCY_MULTIPLIERS = {
      normal: 1.0,
      urgent: 1.2, // +20%
      critical: 1.5, // +50%
    }

    let complexityLevel = "low"
    let matchedKeywords = []

    const lowerDescription = description.toLowerCase()
    const allKeywords = Object.values(COMPLEXITY_KEYWORDS).flat()

    for (const level in COMPLEXITY_KEYWORDS) {
      COMPLEXITY_KEYWORDS[level].forEach((keyword) => {
        if (lowerDescription.includes(keyword) || technologies.includes(keyword)) {
          matchedKeywords.push(keyword)
          if (level === "critical") complexityLevel = "critical"
          else if (level === "high" && complexityLevel !== "critical")
            complexityLevel = "high"
          else if (level === "medium" && complexityLevel !== "critical" && complexityLevel !== "high")
            complexityLevel = "medium"
        }
      })
    }

    // Adjust complexity based on urgency
    if (urgency === "critical" && complexityLevel !== "critical") {
        if (complexityLevel === "high") complexityLevel = "critical";
        else if (complexityLevel === "medium") complexityLevel = "high";
        else if (complexityLevel === "low") complexityLevel = "medium";
    } else if (urgency === "urgent" && (complexityLevel === "low" || complexityLevel === "medium")) {
        if (complexityLevel === "low") complexityLevel = "medium";
        else if (complexityLevel === "medium") complexityLevel = "high";
    }


    const baseCost = BASE_COSTS[team] ? BASE_COSTS[team][complexityLevel] : 0
    const hourlyRate = HOURLY_RATES[team] || 0
    const complexityMultiplier = (
      1 +
      (matchedKeywords.length * 0.05) +
      (complexityLevel === "critical" ? 0.3 : 0) +
      (complexityLevel === "high" ? 0.2 : 0) +
      (complexityLevel === "medium" ? 0.1 : 0)
    ).toFixed(2) // Adding multiplier for keywords

    const urgencyMultiplier = URGENCY_MULTIPLIERS[urgency] || 1.0;

    let estimatedCost = baseCost * complexityMultiplier * urgencyMultiplier;

    if (estimatedCost === 0 && description.length > 0) {
      // Fallback for cases where team or keywords don't match,
      // but there's a description. A basic cost based on description length.
      estimatedCost = Math.round(description.length * 50 + 10000 * urgencyMultiplier);
    }
    // Ensure minimum cost
    estimatedCost = Math.max(estimatedCost, 10000 * urgencyMultiplier);


    return {
      complexity: complexityLevel,
      estimated_cost: Math.round(estimatedCost),
      breakdown: {
        baseRate: baseCost,
        hourly_rate: hourlyRate,
        complexity_multiplier: parseFloat(complexityMultiplier),
        urgency_multiplier: urgencyMultiplier,
      },
      keywords: [...new Set(matchedKeywords)], // Unique keywords
    }
  } catch (error) {
    console.error("Error analyzing complexity:", error)
    return {
      complexity: "unknown",
      estimated_cost: "N/A",
      breakdown: {},
      keywords: [],
    }
  }
}

// Function to generate a unique ID
function generateUniqueId() {
  return "proj" + Date.now() + Math.floor(Math.random() * 1000)
}

// Function to render a single task card
function createTaskCard(project) {
  const card = document.createElement("div")
  card.className = "kanban-task"
  card.setAttribute("draggable", "true")
  card.dataset.projectId = project.id

  card.innerHTML = `
        <h4>${project.name}</h4>
        <p>${project.description.substring(0, 100)}...</p>
        <div class="task-meta">
            <span><strong>Команда:</strong> ${project.team}</span>
            <div class="task-tags">
                ${project.technologies
                  .map((tech) => `<span class="task-tag">${tech}</span>`)
                  .join("")}
            </div>
        </div>
    `

  card.addEventListener("click", () => showProjectDetails(project.id))
  return card
}

// Function to render all projects into their respective columns
function renderProjects() {
  const newTasksColumn = document
    .getElementById("newTasksColumn")
    .querySelector(".kanban-tasks")
  const inProgressTasksColumn = document
    .getElementById("inProgressTasksColumn")
    .querySelector(".kanban-tasks")
  const completedTasksColumn = document
    .getElementById("completedTasksColumn")
    .querySelector(".kanban-tasks")

  // Clear existing tasks
  newTasksColumn.innerHTML = ""
  inProgressTasksColumn.innerHTML = ""
  completedTasksColumn.innerHTML = ""

  projects.forEach((project) => {
    const card = createTaskCard(project)
    if (project.status === "new") {
      newTasksColumn.appendChild(card)
    } else if (project.status === "in-progress") {
      inProgressTasksColumn.appendChild(card)
    } else if (project.status === "completed") {
      completedTasksColumn.appendChild(card)
    }
  })

  addDragDropListeners()
}

// Function to update project status
function updateProjectStatus(projectId, newStatus) {
  const projectIndex = projects.findIndex((p) => p.id === projectId)
  if (projectIndex !== -1) {
    projects[projectIndex].status = newStatus
    projects[projectIndex].lastUpdate = new Date().toISOString().slice(0, 10);
    renderProjects() // Re-render to reflect changes
  }
}

// Add drag and drop listeners to tasks and columns
function addDragDropListeners() {
  const tasks = document.querySelectorAll(".kanban-task")
  const columns = document.querySelectorAll(".kanban-column")

  tasks.forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      draggedTask = e.target
      e.target.classList.add("dragging")
    })

    task.addEventListener("dragend", (e) => {
      e.target.classList.remove("dragging")
      draggedTask = null
    })
  })

  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => {
      e.preventDefault() // Allow drop
      const afterElement = getDragAfterElement(column.querySelector(".kanban-tasks"), e.clientY)
      const draggable = document.querySelector(".dragging")
      if (draggable) {
        const kanbanTasksContainer = column.querySelector(".kanban-tasks");
        if (afterElement == null) {
            kanbanTasksContainer.appendChild(draggable)
        } else {
            kanbanTasksContainer.insertBefore(draggable, afterElement)
        }
      }
    })

    column.addEventListener("drop", (e) => {
      e.preventDefault()
      if (draggedTask) {
        const newStatus = column.dataset.status
        const projectId = draggedTask.dataset.projectId
        updateProjectStatus(projectId, newStatus)
      }
    })
  })
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".kanban-task:not(.dragging)"),
  ]

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element
}

// Show project details in modal
function showProjectDetails(projectId) {
  const project = projects.find((p) => p.id === projectId)
  if (!project) return

  currentEditingProjectId = projectId; // Set current editing project ID

  // DOM elements from the modal (need to be declared globally or passed)
  const modalProjectName = document.getElementById("modalProjectName");
  const modalBodyContent = document.getElementById("modalBodyContent");
  const projectDetailsModal = document.getElementById("projectDetailsModal");
  const editProjectBtn = document.getElementById("editProjectBtn");
  const saveChangesBtn = document.getElementById("saveChangesBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");


  modalProjectName.textContent = project.name
  modalBodyContent.innerHTML = `
        <div class="detail-item"><strong>Описание:</strong> <p>${project.description}</p></div>
        <div class="detail-item"><strong>Статус:</strong> <span class="complexity-${project.status}">${getProjectStatusName(project.status)}</span></div>
        <div class="detail-item"><strong>Команда:</strong> <span>${project.team}</span></div>
        <div class="detail-item"><strong>Технологии:</strong> <span>${project.technologies.join(", ")}</span></div>
        <div class="detail-item"><strong>Сложность:</strong> <span class="complexity-${project.complexity}">${getComplexityName(project.complexity)}</span></div>
        <div class="detail-item"><strong>Оценочная стоимость:</strong> <span>${project.estimatedCost} ₽</span></div>
        <div class="detail-item"><strong>Дата создания:</strong> <span>${project.creationDate}</span></div>
        <div class="detail-item"><strong>Последнее обновление:</strong> <span>${project.lastUpdate}</span></div>
        <div class="detail-item"><strong>Срочность:</strong> <span>${getUrgencyName(project.urgency)}</span></div>
        <div class="detail-item"><strong>Начало:</strong> <span>${project.startDate || 'N/A'}</span></div>
        <div class="detail-item"><strong>Конец:</strong> <span>${project.endDate || 'N/A'}</span></div>
        <div class="detail-item"><strong>Исполнители:</strong> <span>${(project.assignedTo || []).join(", ") || 'Не назначены'}</span></div>
    `
  projectDetailsModal.style.display = "flex"

  // Hide edit/save/cancel buttons initially, show edit
  editProjectBtn.style.display = "inline-block";
  saveChangesBtn.style.display = "none";
  cancelEditBtn.style.display = "none";
}

function getProjectStatusName(status) {
    const names = {
        new: "Новая",
        "in-progress": "В работе",
        completed: "Завершена",
    };
    return names[status] || status;
}

function getComplexityName(complexity) {
    const names = {
        low: "Низкая",
        medium: "Средняя",
        high: "Высокая",
        critical: "Критическая",
        unknown: "Неизвестна"
    };
    return names[complexity] || complexity;
}

function getUrgencyName(urgency) {
    const names = {
        normal: "Нормальная",
        urgent: "Срочная",
        critical: "Критическая"
    };
    return names[urgency] || urgency;
}

// Edit project details
function editProjectDetails() {
  const project = projects.find((p) => p.id === currentEditingProjectId);
  if (!project) return;

  const modalBodyContent = document.getElementById("modalBodyContent");
  const editProjectBtn = document.getElementById("editProjectBtn");
  const saveChangesBtn = document.getElementById("saveChangesBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");


  modalBodyContent.innerHTML = `
        <div class="detail-item">
            <label for="editProjectName">Название проекта:</label>
            <input type="text" id="editProjectName" value="${project.name}">
        </div>
        <div class="detail-item">
            <label for="editProjectDescription">Описание:</label>
            <textarea id="editProjectDescription">${project.description}</textarea>
        </div>
        <div class="detail-item">
            <label for="editProjectStatus">Статус:</label>
            <select id="editProjectStatus">
                <option value="new" ${project.status === 'new' ? 'selected' : ''}>Новая</option>
                <option value="in-progress" ${project.status === 'in-progress' ? 'selected' : ''}>В работе</option>
                <option value="completed" ${project.status === 'completed' ? 'selected' : ''}>Завершена</option>
            </select>
        </div>
        <div class="detail-item">
            <label for="editProjectTeam">Команда:</label>
            <select id="editProjectTeam">
                <option value="frontend" ${project.team === 'frontend' ? 'selected' : ''}>Frontend</option>
                <option value="backend" ${project.team === 'backend' ? 'selected' : ''}>Backend</option>
                <option value="mobile" ${project.team === 'mobile' ? 'selected' : ''}>Mobile</option>
                <option value="devops" ${project.team === 'devops' ? 'selected' : ''}>DevOps</option>
            </select>
        </div>
        <div class="detail-item">
            <label for="editProjectTechnologies">Технологии (через запятую):</label>
            <input type="text" id="editProjectTechnologies" value="${project.technologies.join(', ')}">
        </div>
        <div class="detail-item">
            <label for="editProjectComplexity">Сложность:</label>
            <select id="editProjectComplexity">
                <option value="low" ${project.complexity === 'low' ? 'selected' : ''}>Низкая</option>
                <option value="medium" ${project.complexity === 'medium' ? 'selected' : ''}>Средняя</option>
                <option value="high" ${project.complexity === 'high' ? 'selected' : ''}>Высокая</option>
                <option value="critical" ${project.complexity === 'critical' ? 'selected' : ''}>Критическая</option>
            </select>
        </div>
        <div class="detail-item">
            <label for="editProjectEstimatedCost">Оценочная стоимость:</label>
            <input type="number" id="editProjectEstimatedCost" value="${project.estimatedCost}">
        </div>
         <div class="detail-item">
            <label for="editProjectUrgency">Срочность:</label>
            <select id="editProjectUrgency">
                <option value="normal" ${project.urgency === 'normal' ? 'selected' : ''}>Нормальная</option>
                <option value="urgent" ${project.urgency === 'urgent' ? 'selected' : ''}>Срочная</option>
                <option value="critical" ${project.urgency === 'critical' ? 'selected' : ''}>Критическая</option>
            </select>
        </div>
        <div class="detail-item">
            <label for="editProjectStartDate">Дата начала:</label>
            <input type="date" id="editProjectStartDate" value="${project.startDate || ''}">
        </div>
        <div class="detail-item">
            <label for="editProjectEndDate">Предполагаемая дата завершения:</label>
            <input type="date" id="editProjectEndDate" value="${project.endDate || ''}">
        </div>
        <div class="detail-item">
            <label for="editProjectAssignedTo">Исполнители (через запятую):</label>
            <input type="text" id="editProjectAssignedTo" value="${(project.assignedTo || []).join(', ')}">
        </div>
    `;

  editProjectBtn.style.display = "none";
  saveChangesBtn.style.display = "inline-block";
  cancelEditBtn.style.display = "inline-block";
}

// Save changes to project
function saveProjectChanges() {
  const projectIndex = projects.findIndex((p) => p.id === currentEditingProjectId);
  if (projectIndex === -1) return;

  // Retrieve values from the dynamically created input fields
  const editedProject = {
    ...projects[projectIndex],
    name: document.getElementById('editProjectName').value,
    description: document.getElementById('editProjectDescription').value,
    status: document.getElementById('editProjectStatus').value,
    team: document.getElementById('editProjectTeam').value,
    technologies: document.getElementById('editProjectTechnologies').value.split(',').map(tech => tech.trim()).filter(tech => tech !== ''),
    complexity: document.getElementById('editProjectComplexity').value,
    estimatedCost: parseInt(document.getElementById('editProjectEstimatedCost').value),
    urgency: document.getElementById('editProjectUrgency').value,
    startDate: document.getElementById('editProjectStartDate').value,
    endDate: document.getElementById('editProjectEndDate').value,
    assignedTo: document.getElementById('editProjectAssignedTo').value.split(',').map(name => name.trim()).filter(name => name !== ''),
    lastUpdate: new Date().toISOString().slice(0, 10)
  };

  projects[projectIndex] = editedProject;
  renderProjects(); // Re-render Kanban board
  showProjectDetails(currentEditingProjectId); // Re-show details with updated info
}

// Cancel editing
function cancelEdit() {
  showProjectDetails(currentEditingProjectId); // Simply re-show details to revert
}


// Show analysis results
function showAnalysisResults(result) {
    const analysisResults = document.getElementById("analysisResults");
    const analysisContent = analysisResults.querySelector(".analysis-content");

    // Add urgency details if applicable
    let urgencyText = '';
    if (result.breakdown && result.breakdown.urgency_multiplier && result.breakdown.urgency_multiplier > 1) {
        urgencyText = `
            <div class="analysis-item">
                <strong>Множитель срочности:</strong>
                <span>x${result.breakdown.urgency_multiplier}</span>
            </div>
        `;
    }

    const breakdownHtml = result.breakdown
        ? `
            <div class="analysis-item">
                <strong>Базовая стоимость:</strong>
                <span>${result.breakdown.baseRate || 'N/A'} ₽</span>
            </div>
            <div class="analysis-item">
                <strong>Ставка в час:</strong>
                <span>${result.breakdown.hourly_rate || result.breakdown.baseRate || 'N/A'} ₽</span>
            </div>
            <div class="analysis-item">
                <strong>Множитель сложности:</strong>
                <span>${result.breakdown.complexity_multiplier || result.breakdown.complexityMultiplier || 'N/A'}</span>
            </div>
            ${urgencyText}
        `
        : "";

    analysisContent.innerHTML = `
        <div class="analysis-item">
            <strong>Сложность:</strong>
            <span class="complexity-${result.complexity}">${getComplexityName(result.complexity)}</span>
        </div>
        <div class="analysis-item">
            <strong>Оценочная стоимость:</strong>
            <span>${result.estimated_cost || result.estimatedCost} ₽</span>
        </div>
        ${breakdownHtml}
        ${result.keywords && result.keywords.length > 0 ? `
        <div class="analysis-item">
            <strong>Ключевые слова:</strong>
            <span>${result.keywords.join(', ')}</span>
        </div>` : ''}
    `;

    analysisResults.style.display = "block";
}

// Function to handle sidebar navigation clicks
function setupSidebarNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const contentAreas = document.querySelectorAll('.content-area');
    const mainContentHeader = document.getElementById('mainContentHeader');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(nav => nav.classList.remove('active'));
            // Add active class to the clicked link
            link.classList.add('active');

            const targetContentId = link.dataset.contentId;
            let headerText = "Панель администратора"; // Default header text

            // Hide all content areas
            contentAreas.forEach(area => area.style.display = 'none');

            // Show the target content area and update header
            if (targetContentId === 'projects') {
                document.getElementById('projectsContent').style.display = 'flex'; // Use flex for column layout
                headerText = "Проекты";
            } else if (targetContentId === 'teams') {
                document.getElementById('teamsContent').style.display = 'flex'; // Or 'block' depending on layout
                headerText = "Команды";
                renderTeams(); // Render teams when navigating to this section
            } else if (targetContentId === 'reports') {
                document.getElementById('reportsContent').style.display = 'flex';
                headerText = "Отчеты";
                renderCharts(); // Render charts when navigating to this section
            } else if (targetContentId === 'settings') {
                document.getElementById('settingsContent').style.display = 'flex';
                headerText = "Настройки";
            }
            mainContentHeader.textContent = headerText; // Update main header
        });
    });
}

// Function to render teams (simplified from image)
function renderTeams() {
    const teamsGrid = document.getElementById('teamsGrid');
    teamsGrid.innerHTML = ''; // Clear existing content

    for (const teamKey in teams) {
        const team = teams[teamKey];
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <h3>${team.name}</h3>
            <p>${team.description}</p>
            <h4>Участники команды:</h4>
            <ul class="team-member-list">
                ${team.members.map(member => `<li>${member}</li>`).join('')}
            </ul>
            <div class="team-projects-list">
                <h4>Активные проекты:</h4>
                <ul>
                    ${projects.filter(p => p.team === teamKey && p.status !== 'completed')
                              .map(p => `<li><strong>${p.name}</strong> (C ${p.startDate || 'N/A'} по ${p.endDate || 'N/A'})</li>`).join('')}
                    ${projects.filter(p => p.team === teamKey && p.status === 'completed')
                              .map(p => `<li><strong>${p.name}</strong> (Завершен)</li>`).join('')}
                </ul>
            </div>
        `;
        teamsGrid.appendChild(teamCard);
    }
}

// Function to render charts
function renderCharts() {
    // Destroy existing chart instances if they exist
    if (teamWorkloadChartInstance) {
        teamWorkloadChartInstance.destroy();
    }
    if (projectCompletionChartInstance) {
        projectCompletionChartInstance.destroy();
    }

    // Team Workload Chart
    const teamWorkloadCtx = document.getElementById('teamWorkloadChart').getContext('2d');
    const teamWorkload = {};
    for (const teamKey in teams) {
        teamWorkload[teams[teamKey].name] = 0;
    }
    projects.forEach(project => {
        if (project.status !== 'completed' && teams[project.team]) {
            teamWorkload[teams[project.team].name]++;
        }
    });

    teamWorkloadChartInstance = new Chart(teamWorkloadCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(teamWorkload),
            datasets: [{
                label: 'Количество активных проектов',
                data: Object.values(teamWorkload),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-medium')
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-medium')
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-dark')
                    }
                }
            }
        }
    });

    // Project Completion Chart
    const projectCompletionCtx = document.getElementById('projectCompletionChart').getContext('2d');
    const statusCounts = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
    }, {});

    projectCompletionChartInstance = new Chart(projectCompletionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Новые', 'В работе', 'Завершенные'],
            datasets: [{
                label: 'Количество проектов',
                data: [
                    statusCounts['new'] || 0,
                    statusCounts['in-progress'] || 0,
                    statusCounts['completed'] || 0
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)', // Blue for New
                    'rgba(255, 206, 86, 0.6)', // Yellow for In Progress
                    'rgba(75, 192, 192, 0.6)'  // Green for Completed
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--text-dark')
                    }
                }
            }
        }
    });
}

// Function to handle theme switching
function setupThemeSwitch() {
    const themeSwitch = document.getElementById('themeSwitch');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', () => {
        if (themeSwitch.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
        // Re-render charts to update their text/line colors if theme changes
        if (document.getElementById('reportsContent').style.display === 'flex') {
            renderCharts();
        }
    });
}


// --- Event Listeners and Initial Load ---
document.addEventListener("DOMContentLoaded", () => {
    // Dynamically inject CSS
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = adminCss;
    document.head.appendChild(styleSheet);

    // Dynamically inject HTML
    document.body.innerHTML = adminHtmlContent;

    // --- Get DOM Elements AFTER HTML injection ---
    const loginFormEl = document.getElementById("loginForm");
    const loginContainerEl = document.getElementById("loginContainer");
    const adminDashboardEl = document.getElementById("adminDashboard");
    const currentUserNameEl = document.getElementById("currentUserName");
    const userAvatarInitialEl = document.getElementById("userAvatarInitial");
    const projectDetailsModal = document.getElementById("projectDetailsModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const editProjectBtn = document.getElementById("editProjectBtn");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    const cancelEditBtn = document.getElementById("cancelEditBtn");
    const loadingOverlay = document.getElementById("loadingOverlay");
    const projectAnalysisForm = document.getElementById("projectAnalysisForm");
    const addProjectToKanbanBtn = document.getElementById("addProjectToKanban");
    const createProjectForm = document.getElementById("createProjectForm"); // New form


    // Login
    loginFormEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = loginFormEl.username.value;
        const password = loginFormEl.password.value;

        if (users[username] && users[username].password === password) {
            currentLoggedInUser = users[username];
            loginContainerEl.style.display = "none";
            adminDashboardEl.style.display = "flex";
            currentUserNameEl.textContent = currentLoggedInUser.name;
            userAvatarInitialEl.textContent = currentLoggedInUser.name.charAt(0).toUpperCase();
            renderProjects(); // Initial render of projects
            setupSidebarNavigation(); // Setup sidebar navigation
            setupThemeSwitch(); // Setup theme switch
        } else {
            alert("Неверный логин или пароль!");
        }
    });

    // Logout
    document.querySelector(".logout-btn").addEventListener("click", () => {
        currentLoggedInUser = null;
        adminDashboardEl.style.display = "none";
        loginContainerEl.style.display = "flex";
        loginFormEl.reset(); // Clear login form
        document.getElementById("analysisResults").style.display = "none"; // Hide analysis results on logout
        localStorage.removeItem('theme'); // Clear theme preference on logout
        document.body.classList.remove('dark-theme'); // Reset theme
        document.getElementById('themeSwitch').checked = false; // Reset toggle
    });

    // Close Modal
    closeModalBtn.addEventListener("click", () => {
        projectDetailsModal.style.display = "none";
        currentEditingProjectId = null; // Clear current editing project
    });

    // Edit Project Button
    editProjectBtn.addEventListener("click", editProjectDetails);

    // Save Changes Button
    saveChangesBtn.addEventListener("click", saveProjectChanges);

    // Cancel Edit Button
    cancelEditBtn.addEventListener("click", cancelEdit);

    // Project Analysis Form
    projectAnalysisForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        loadingOverlay.style.display = "flex"; // Show loading overlay

        const description = projectAnalysisForm.projectDescription.value;
        const team = projectAnalysisForm.projectTeam.value;
        const urgency = projectAnalysisForm.projectUrgency.value;
        const technologies = Array.from(
            projectAnalysisForm.querySelectorAll('input[name="technologies"]:checked')
        ).map((cb) => cb.value);

        latestAnalysisResult = await analyzeComplexity(description, team, technologies, urgency);
        showAnalysisResults(latestAnalysisResult);

        loadingOverlay.style.display = "none"; // Hide loading overlay
        addProjectToKanbanBtn.style.display = 'inline-block'; // Show "Add to Kanban" button
    });

    // Add Project to Kanban Button
    addProjectToKanbanBtn.addEventListener("click", () => {
        if (!latestAnalysisResult) {
            alert("Сначала проанализируйте проект.");
            return;
        }

        const projectDescription = projectAnalysisForm.projectDescription.value;
        const projectTeam = projectAnalysisForm.projectTeam.value;
        const projectTechnologies = Array.from(
            projectAnalysisForm.querySelectorAll('input[name="technologies"]:checked')
        ).map((cb) => cb.value);
        const projectUrgency = projectAnalysisForm.projectUrgency.value;


        const newProject = {
            id: generateUniqueId(),
            name: projectDescription.substring(0, 50) + (projectDescription.length > 50 ? '...' : ''), // Take first 50 chars as name
            description: projectDescription,
            status: "new", // Always new when added from analysis
            team: projectTeam,
            technologies: projectTechnologies,
            complexity: latestAnalysisResult.complexity,
            estimatedCost: latestAnalysisResult.estimated_cost,
            creationDate: new Date().toISOString().slice(0, 10),
            lastUpdate: new Date().toISOString().slice(0, 10),
            urgency: projectUrgency,
            startDate: new Date().toISOString().slice(0, 10), // Default start date
            endDate: "", // Default empty end date
            assignedTo: []
        };

        projects.push(newProject);
        renderProjects(); // Re-render the kanban board with the new project

        // Optionally, clear the form and hide analysis results
        projectAnalysisForm.reset();
        document.getElementById("analysisResults").style.display = "none";
        addProjectToKanbanBtn.style.display = 'none'; // Hide button after adding
        alert("Проект добавлен на Kanban доску!");
    });

    // Create New Project Form
    createProjectForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const projectName = createProjectForm.createProjectName.value;
        const projectDescription = createProjectForm.createProjectDescription.value;
        const projectTeam = createProjectForm.createProjectTeam.value;
        const projectStartDate = createProjectForm.createProjectStartDate.value;
        const projectEndDate = createProjectForm.createProjectEndDate.value;

        if (!projectName || !projectTeam || !projectStartDate) {
            alert("Пожалуйста, заполните все обязательные поля: Название, Команда, Дата начала.");
            return;
        }

        const newProject = {
            id: generateUniqueId(),
            name: projectName,
            description: projectDescription,
            status: "new",
            team: projectTeam,
            technologies: [], // Can add a field for this in the form
            complexity: "unknown", // Can add a field or derive
            estimatedCost: 0, // Can add a field or derive
            creationDate: new Date().toISOString().slice(0, 10),
            lastUpdate: new Date().toISOString().slice(0, 10),
            urgency: "normal", // Can add a field
            startDate: projectStartDate,
            endDate: projectEndDate,
            assignedTo: [] // Can add a field for this
        };

        projects.push(newProject);
        renderProjects();
        createProjectForm.reset();
        alert("Новый проект успешно создан и добавлен на Kanban доску!");
    });


    // Initial state for "Add to Kanban" button
    addProjectToKanbanBtn.style.display = 'none';
});

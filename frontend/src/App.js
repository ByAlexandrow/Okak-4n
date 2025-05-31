import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import AdminPage from "./pages/AdminPage"
import LoginPage from "./pages/LoginPage"
import NotFoundPage from "./pages/NotFoundPage"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"
import Toast from "./components/Toast"

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen font-sans">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toast />
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App

"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { FiUser, FiLock, FiLogIn } from "react-icons/fi"

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    // Простая проверка логина
    if (credentials.username === "admin" && credentials.password === "admin") {
      login({ username: "admin", role: "admin" })
      navigate("/admin")
    } else {
      alert("Неверные данные для входа")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
          <p className="text-gray-600 mt-2">Введите ваши данные для входа</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                placeholder="admin"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiLogIn className="w-4 h-4 mr-2" />
            Войти
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Тестовые данные:</p>
          <p>Логин: admin, Пароль: admin</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

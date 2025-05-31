"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const response = await api.get("/api/users/current/")
          setUser(response.data)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("token")
        delete api.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    try {
      const response = await api.post("/api/users/login/", { username, password })
      if (response.data.success) {
        const { user, profile, token } = response.data
        localStorage.setItem("token", token)
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`
        setUser({ ...user, role: profile.role })
        return { success: true }
      }
      return { success: false, message: response.data.message || "Ошибка входа" }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Ошибка сервера при входе",
      }
    }
  }

  const logout = async () => {
    try {
      await api.post("/api/users/logout/")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
      setUser(null)
      navigate("/login")
    }
  }

  // Для демо-режима
  const demoLogin = (role) => {
    const demoUser = {
      id: "demo",
      username: role === "admin" ? "admin" : "manager",
      email: `${role}@example.com`,
      first_name: role === "admin" ? "Админ" : "Менеджер",
      last_name: "Демо",
      role: role,
    }
    setUser(demoUser)
    return { success: true }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    demoLogin,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

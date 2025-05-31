"use client"

import { createContext, useContext, useState } from "react"

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null)

  const showToast = ({ title, message, type = "success" }) => {
    setToast({ title, message, type })
  }

  const hideToast = () => {
    setToast(null)
  }

  const value = {
    toast,
    showToast,
    hideToast,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

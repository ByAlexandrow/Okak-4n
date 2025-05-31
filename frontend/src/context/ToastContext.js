"use client"

import { createContext, useState, useContext } from "react"

const ToastContext = createContext()

export const useToast = () => useContext(ToastContext)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null)

  const showToast = ({ title, message, type = "success", duration = 3000 }) => {
    setToast({ title, message, type, duration })

    if (duration > 0) {
      setTimeout(() => {
        setToast(null)
      }, duration)
    }
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

"use client"

import { useToast } from "../context/ToastContext"
import { FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi"

const Toast = () => {
  const { toast, hideToast } = useToast()

  if (!toast) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`p-4 rounded-lg shadow-lg max-w-sm ${
          toast.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {toast.type === "error" ? <FiAlertCircle className="w-5 h-5" /> : <FiCheckCircle className="w-5 h-5" />}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{toast.title}</p>
            {toast.message && <p className="mt-1 text-sm opacity-90">{toast.message}</p>}
          </div>
          <button onClick={hideToast} className="ml-4 flex-shrink-0">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast

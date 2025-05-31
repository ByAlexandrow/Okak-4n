import { Link } from "react-router-dom"
import { FiHome, FiAlertTriangle } from "react-icons/fi"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <FiAlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Страница не найдена</h2>
        <p className="text-gray-600 mb-8">Извините, запрашиваемая страница не существует.</p>
        <Link to="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <FiHome className="w-4 h-4 mr-2" />
          На главную
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage

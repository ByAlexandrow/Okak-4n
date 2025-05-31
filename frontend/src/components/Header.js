import { FiCode, FiUser } from "react-icons/fi"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FiCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DevRequest</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Главная
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              Админ панель
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
              <FiUser className="w-4 h-4" />
              <span>Войти</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

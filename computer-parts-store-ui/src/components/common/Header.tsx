import { Heart, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/auth.slice'
import { authService } from '@/services/auth.service'

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { totalItems } = useAppSelector((state) => state.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    dispatch(logout())
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const isAdmin = user?.roleName?.toUpperCase() === 'ADMIN'

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🖥️</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">ComputerParts</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-primary-600 font-semibold text-primary-600">
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative text-gray-700 hover:text-primary-600">
              <Heart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            <Link to="/cart" className="relative text-gray-700 hover:text-primary-600">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded hover:bg-gray-100"
                >
                  <User size={24} />
                  <span className="hidden sm:inline text-sm font-medium">{user.userName}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs mt-1 px-2 py-1 bg-primary-100 text-primary-700 rounded inline-block">
                        {isAdmin ? '👑 Admin' : '👤 Customer'}
                      </p>
                    </div>
                    <div className="p-2">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          📊 Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        🏠 Home
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded text-sm flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 text-sm font-medium">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-2">
            <Link to="/products" className="block text-gray-700 hover:text-primary-600 py-2">
              Products
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block text-primary-600 font-semibold py-2">
                Admin Dashboard
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 hover:text-red-700 py-2 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
            {!isAuthenticated && (
              <Link to="/login" className="block bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

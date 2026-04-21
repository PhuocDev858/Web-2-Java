import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
} from 'lucide-react'
import { useAppDispatch } from '@/store/hooks'
import { logout } from '@/store/auth.slice'
import { authService } from '@/services/auth.service'

interface AdminSidebarProps {
  isOpen: boolean
}

export const AdminSidebar = ({ isOpen }: AdminSidebarProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    authService.logout()
    dispatch(logout())
    navigate('/')
  }

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Products', icon: Package, href: '/admin/products' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    // TODO: Enable these features later
    // { label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
    // { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
    // { label: 'Reports', icon: BarChart3, href: '/admin/reports' },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold">🖥️</span>
          </div>
          {isOpen && <span className="font-bold text-xl">Admin</span>}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {isOpen && <span className="text-sm font-semibold">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {isOpen && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

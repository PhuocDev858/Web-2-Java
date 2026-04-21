import { Menu, Bell, Settings, User } from 'lucide-react'
import { useAppSelector } from '@/store/hooks'

interface AdminHeaderProps {
  onMenuToggle: () => void
}

export const AdminHeader = ({ onMenuToggle }: AdminHeaderProps) => {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}

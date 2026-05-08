import { Edit, Trash2, ShieldCheck, ShieldOff } from 'lucide-react'

export interface UserData {
  id: number
  username: string
  email: string
  fullName: string
  phone: string
  address: string
  isActive: boolean
  createdAt?: string
}

interface UserTableProps {
  users: UserData[]
  onEdit: (user: UserData) => void
  onDelete: (userId: number) => void
  onToggleActive: (user: UserData) => void
}

export const UserTable = ({ users, onEdit, onDelete, onToggleActive }: UserTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full min-w-max">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tên đăng nhập</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Họ tên</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Số điện thoại</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Địa chỉ</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Trạng thái</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 text-sm text-gray-500">#{user.id}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                    {(user.fullName || user.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-gray-900">{user.username}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-700">{user.fullName || '—'}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-4 py-4 text-sm text-gray-600">{user.phone || '—'}</td>
              <td className="px-4 py-4 text-sm text-gray-600 max-w-[180px] truncate" title={user.address}>
                {user.address || '—'}
              </td>
              <td className="px-4 py-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.isActive ? '✅ Hoạt động' : '🚫 Bị khoá'}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-1">
                  {/* Khoá / Mở khoá */}
                  <button
                    onClick={() => onToggleActive(user)}
                    className={`p-2 rounded transition-colors ${
                      user.isActive
                        ? 'hover:bg-red-100 text-red-500'
                        : 'hover:bg-green-100 text-green-600'
                    }`}
                    title={user.isActive ? 'Khoá tài khoản' : 'Mở khoá'}
                  >
                    {user.isActive ? <ShieldOff size={17} /> : <ShieldCheck size={17} />}
                  </button>
                  {/* Sửa */}
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={17} />
                  </button>
                  {/* Xoá */}
                  <button
                    onClick={() => onDelete(user.id)}
                    className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
                    title="Xoá"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">👥</div>
          <p className="text-gray-500">Không có người dùng nào</p>
        </div>
      )}
    </div>
  )
}

import { Trash2, ShieldAlert } from 'lucide-react'
import type { User } from '@/types'

interface UserTableProps {
  users: User[]
  onDelete: (userId: string) => void
}

export const UserTable = ({ users, onDelete }: UserTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Username
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-semibold text-gray-900">{user.fullName}</td>
              <td className="px-6 py-4 text-gray-600 text-sm">{user.email}</td>
              <td className="px-6 py-4 text-gray-600">@{user.username}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">{user.phone || '-'}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onDelete(user.id)}
                  className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors"
                  disabled={user.role === 'ADMIN'}
                  title={user.role === 'ADMIN' ? 'Cannot delete admin' : 'Delete user'}
                >
                  {user.role === 'ADMIN' ? <ShieldAlert size={18} /> : <Trash2 size={18} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

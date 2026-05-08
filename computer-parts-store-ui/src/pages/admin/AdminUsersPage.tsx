import { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { UserTable } from '@/components/admin/tables/UserTable'
import { UserFormModal } from '@/components/admin/modals/UserFormModal'
import { apiClient } from '@/services/api'
import { showSuccess, showError } from '@/utils/toast'
import { Plus, RefreshCw, Search } from 'lucide-react'
import type { UserData } from '@/components/admin/tables/UserTable'

export const AdminUsersPage = () => {
  const [users, setUsers]               = useState<UserData[]>([])
  const [filtered, setFiltered]         = useState<UserData[]>([])
  const [loading, setLoading]           = useState(true)
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isSaving, setIsSaving]         = useState(false)
  const [search, setSearch]             = useState('')

  useEffect(() => { fetchUsers() }, [])

  // Filter khi search thay đổi
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      q
        ? users.filter(
            (u) =>
              u.username?.toLowerCase().includes(q) ||
              u.fullName?.toLowerCase().includes(q) ||
              u.email?.toLowerCase().includes(q) ||
              u.phone?.includes(q)
          )
        : users
    )
  }, [search, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<any>('/users')
      let list: UserData[] = []
      if (Array.isArray(response.data))                   list = response.data
      else if (Array.isArray(response.data?.content))     list = response.data.content
      else if (Array.isArray(response.data?.data))        list = response.data.data
      setUsers(list)
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Không thể tải danh sách người dùng'
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ===== CREATE =====
  const handleAdd = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  // ===== EDIT =====
  const handleEdit = (user: UserData) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  // ===== SUBMIT (create or update) =====
  const handleSubmit = async (data: Partial<UserData> & { password?: string }) => {
    try {
      setIsSaving(true)
      if (selectedUser) {
        // UPDATE — gọi PUT /users/{id}
        await apiClient.put(`/users/${selectedUser.id}`, {
          fullName: data.fullName,
          phone:    data.phone,
          address:  data.address,
          email:    data.email,
        })
        showSuccess('Cập nhật người dùng thành công!')
      } else {
        // CREATE — gọi POST /users/register
        await apiClient.post('/users/register', {
          username: data.username,
          password: data.password,
          fullName: data.fullName,
          email:    data.email,
          phone:    data.phone,
          address:  data.address || '',
        })
        showSuccess('Thêm người dùng thành công!')
      }
      await fetchUsers()
      setIsModalOpen(false)
      setSelectedUser(null)
    } catch (err: any) {
      const msg =
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || err.message || 'Lỗi khi lưu người dùng'
      throw new Error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  // ===== DELETE =====
  const handleDelete = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xoá người dùng này?')) return
    try {
      await apiClient.delete(`/users/${userId}`)
      showSuccess('Đã xoá người dùng!')
      await fetchUsers()
    } catch (err: any) {
      showError('Không thể xoá người dùng')
    }
  }

  // ===== TOGGLE ACTIVE (khoá / mở khoá) =====
  const handleToggleActive = async (user: UserData) => {
    const action = user.isActive ? 'khoá' : 'mở khoá'
    if (!confirm(`Bạn có chắc muốn ${action} tài khoản "${user.username}"?`)) return
    try {
      if (user.isActive) {
        // Khoá → DELETE (soft delete)
        await apiClient.delete(`/users/${user.id}`)
      } else {
        // Mở khoá → cần endpoint riêng nếu backend có, tạm thời thông báo
        showError('Backend chưa có endpoint mở khoá. Vui lòng thêm endpoint PUT /users/{id}/activate.')
        return
      }
      showSuccess(`Đã ${action} tài khoản ${user.username}!`)
      await fetchUsers()
    } catch (err: any) {
      showError(`Không thể ${action} tài khoản`)
    }
  }

  // Stats
  const activeCount   = users.filter((u) => u.isActive).length
  const inactiveCount = users.filter((u) => !u.isActive).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-600 mt-1">
              Tổng cộng:{' '}
              <span className="font-semibold text-primary-600">{users.length}</span> người dùng
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-semibold text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Làm mới
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-semibold text-sm"
            >
              <Plus size={16} />
              Thêm người dùng
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tổng người dùng</p>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Đang hoạt động</p>
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Bị khoá</p>
            <p className="text-3xl font-bold text-red-500">{inactiveCount}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, số điện thoại..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary-600"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-3" />
            <p className="text-gray-600">Đang tải danh sách người dùng...</p>
          </div>
        ) : (
          <UserTable
            users={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        )}
      </div>

      {/* Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={() => { setIsModalOpen(false); setSelectedUser(null) }}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </AdminLayout>
  )
}

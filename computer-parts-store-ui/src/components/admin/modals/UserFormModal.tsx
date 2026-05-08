import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import type { UserData } from '@/components/admin/tables/UserTable'

interface UserFormModalProps {
  isOpen: boolean
  user: UserData | null
  onClose: () => void
  onSubmit: (data: Partial<UserData> & { password?: string }) => Promise<void>
  isLoading?: boolean
}

export const UserFormModal = ({
  isOpen,
  user,
  onClose,
  onSubmit,
  isLoading = false,
}: UserFormModalProps) => {
  const isEdit = !!user
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  })

  // Reset form mỗi khi mở modal
  useEffect(() => {
    if (isOpen) {
      setError(null)
      setForm({
        username:  user?.username  || '',
        fullName:  user?.fullName  || '',
        email:     user?.email     || '',
        phone:     user?.phone     || '',
        address:   user?.address   || '',
        password: '',
        confirmPassword: '',
      })
    }
  }, [isOpen, user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)

    if (!form.username.trim()) { setError('Tên đăng nhập không được để trống'); return }
    if (!form.email.trim())    { setError('Email không được để trống'); return }

    if (!isEdit) {
      if (!form.password)                        { setError('Vui lòng nhập mật khẩu'); return }
      if (form.password.length < 6)              { setError('Mật khẩu phải có ít nhất 6 ký tự'); return }
      if (form.password !== form.confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return }
    }

    try {
      const payload: Partial<UserData> & { password?: string } = {
        username: form.username,
        fullName: form.fullName,
        email:    form.email,
        phone:    form.phone,
        address:  form.address,
      }
      if (!isEdit && form.password) payload.password = form.password
      await onSubmit(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu người dùng')
    }
  }

  const inputCls = 'w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-600'

  return (
    <Modal
      isOpen={isOpen}
      title={isEdit ? `Chỉnh sửa: ${user?.username}` : 'Thêm người dùng mới'}
      onClose={onClose}
      onConfirm={() => handleSubmit()}
      confirmText={isEdit ? 'Cập nhật' : 'Thêm mới'}
      isLoading={isLoading}
    >
      <form
        id="userForm"
        onSubmit={handleSubmit}
        className="space-y-3 max-h-[70vh] overflow-y-auto pr-1"
      >
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">{error}</div>
        )}

        <fieldset disabled={isLoading} className="space-y-3">
          {/* Tên đăng nhập */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tên đăng nhập *
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={isEdit}  // không đổi username khi sửa
              placeholder="vd: nguyenvana"
              className={`${inputCls} ${isEdit ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
            />
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className={inputCls}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className={inputCls}
            />
          </div>

          {/* SĐT + Địa chỉ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0901234567"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Đường ABC"
                className={inputCls}
              />
            </div>
          </div>

          {/* Mật khẩu — chỉ hiện khi tạo mới */}
          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputCls}
                />
              </div>
            </>
          )}
        </fieldset>
      </form>
    </Modal>
  )
}

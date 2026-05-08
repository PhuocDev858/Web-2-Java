import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/common/Layout'
import { apiClient } from '@/services/api'

type Step = 'email' | 'otp' | 'reset' | 'done'

export const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Bước 1: Gửi OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email) { setError('Vui lòng nhập email'); return }
    try {
      setIsLoading(true)
      await apiClient.post('/users/forgot-password/send-otp', { email })
      setMessage(`OTP đã được gửi tới ${email}. Vui lòng kiểm tra hộp thư (và thư mục spam).`)
      setStep('otp')
    } catch (err: any) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : 'Email không tồn tại trong hệ thống'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Bước 2: Xác thực OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!otp || otp.length !== 6) { setError('Vui lòng nhập mã OTP 6 chữ số'); return }
    try {
      setIsLoading(true)
      await apiClient.post('/users/forgot-password/verify-otp', { email, otp })
      setMessage('OTP hợp lệ! Vui lòng đặt mật khẩu mới.')
      setStep('reset')
    } catch (err: any) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : 'OTP không hợp lệ hoặc đã hết hạn'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Bước 3: Đặt lại mật khẩu
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return }
    if (newPassword !== confirmPassword) { setError('Mật khẩu xác nhận không khớp'); return }
    try {
      setIsLoading(true)
      await apiClient.post('/users/forgot-password/reset', { email, newPassword })
      setStep('done')
    } catch (err: any) {
      const msg = typeof err.response?.data === 'string'
        ? err.response.data
        : 'Có lỗi xảy ra, vui lòng thử lại'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const steps: Step[] = ['email', 'otp', 'reset']
  const stepLabels = ['Email', 'OTP', 'Mật khẩu']
  const stepTitles: Record<Step, string> = {
    email: 'Quên Mật Khẩu',
    otp: 'Nhập Mã OTP',
    reset: 'Đặt Lại Mật Khẩu',
    done: 'Thành Công!',
  }

  const currentStepIndex = steps.indexOf(step)

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">

          {/* Progress Steps */}
          {step !== 'done' && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((s, idx) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        idx < currentStepIndex
                          ? 'bg-green-500 text-white'
                          : idx === currentStepIndex
                          ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {idx < currentStepIndex ? '✓' : idx + 1}
                    </div>
                    <span className={`text-xs mt-1 font-medium ${
                      idx === currentStepIndex ? 'text-primary-600' : 'text-gray-400'
                    }`}>
                      {stepLabels[idx]}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mb-4 ${
                      idx < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}

          <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">
            {stepTitles[step]}
          </h1>

          {/* Messages */}
          {message && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded mb-4 text-sm">
              ✅ {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Bước 1: Nhập Email */}
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4 mt-4">
              <p className="text-gray-500 text-sm text-center">
                Nhập email đã đăng ký để nhận mã OTP xác thực
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Đang gửi OTP...' : '📧 Gửi mã OTP'}
              </button>
            </form>
          )}

          {/* Bước 2: Nhập OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 mt-4">
              <p className="text-gray-500 text-sm text-center">
                Nhập mã OTP 6 chữ số được gửi tới{' '}
                <span className="font-semibold text-gray-700">{email}</span>
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mã OTP *
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-primary-600"
                />
                <p className="text-xs text-gray-400 mt-1 text-center">Mã có hiệu lực trong 5 phút</p>
              </div>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Đang xác thực...' : '🔍 Xác nhận OTP'}
              </button>
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep('email'); setOtp(''); setError(''); setMessage('') }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Đổi email
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="text-primary-600 hover:text-primary-700 font-semibold disabled:opacity-50"
                >
                  Gửi lại OTP
                </button>
              </div>
            </form>
          )}

          {/* Bước 3: Mật khẩu mới */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu mới *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác nhận mật khẩu *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-primary-600"
                />
              </div>
              {/* Password strength indicator */}
              {newPassword && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                          newPassword.length > i * 3
                            ? newPassword.length < 6 ? 'bg-red-400'
                              : newPassword.length < 10 ? 'bg-yellow-400'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {newPassword.length < 6 ? 'Quá ngắn' : newPassword.length < 10 ? 'Trung bình' : 'Mạnh'}
                  </p>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
              >
                {isLoading ? 'Đang cập nhật...' : '🔒 Đặt lại mật khẩu'}
              </button>
            </form>
          )}

          {/* Hoàn thành */}
          {step === 'done' && (
            <div className="text-center space-y-4 mt-4">
              <div className="text-7xl">🎉</div>
              <p className="text-green-600 font-semibold text-lg">Mật khẩu đã được đặt lại thành công!</p>
              <p className="text-gray-500 text-sm">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700 transition-colors"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}

          {/* Back to Login */}
          {step !== 'done' && (
            <div className="mt-6 text-center border-t pt-4">
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
              >
                ← Quay lại đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

let toastContainer: HTMLDivElement | null = null
let toasts: Toast[] = []

function getOrCreateContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div')
    toastContainer.id = 'toast-container'
    toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2'
    document.body.appendChild(toastContainer)
  }
  return toastContainer
}

function getToastStyles(type: ToastType): string {
  const baseStyles = 'px-4 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-slideIn'
  switch (type) {
    case 'success':
      return `${baseStyles} bg-green-500`
    case 'error':
      return `${baseStyles} bg-red-500`
    case 'warning':
      return `${baseStyles} bg-yellow-500`
    case 'info':
      return `${baseStyles} bg-blue-500`
  }
}

function removeToast(id: string) {
  const element = document.getElementById(`toast-${id}`)
  if (element) {
    element.classList.add('animate-slideOut')
    setTimeout(() => {
      element?.remove()
      toasts = toasts.filter((t) => t.id !== id)
    }, 300)
  }
}

export function showToast(message: string, type: ToastType = 'info', duration: number = 4000) {
  const id = Date.now().toString()
  const toast: Toast = { id, type, message, duration }

  toasts.push(toast)
  const container = getOrCreateContainer()

  const element = document.createElement('div')
  element.id = `toast-${id}`
  element.className = getToastStyles(type)
  element.textContent = message

  container.appendChild(element)

  if (duration > 0) {
    setTimeout(() => removeToast(id), duration)
  }

  return id
}

export function showSuccess(message: string, duration?: number) {
  return showToast(message, 'success', duration)
}

export function showError(message: string, duration?: number) {
  return showToast(message, 'error', duration)
}

export function showWarning(message: string, duration?: number) {
  return showToast(message, 'warning', duration)
}

export function showInfo(message: string, duration?: number) {
  return showToast(message, 'info', duration)
}

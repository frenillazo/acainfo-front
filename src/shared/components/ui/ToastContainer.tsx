import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useToast } from '@/shared/hooks/useToast'
import type { ToastType } from '@/shared/hooks/useToast'

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const styles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
}

const iconStyles: Record<ToastType, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-0 top-0 z-50 flex flex-col items-end gap-2 p-4">
      {toasts.map((t) => {
        const Icon = icons[t.type]
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all ${styles[t.type]}`}
          >
            <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${iconStyles[t.type]}`} />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 rounded-md p-0.5 opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

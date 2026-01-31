import { AlertTriangle, Ban, Phone, Mail } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import type { UserStatus } from '../types/auth.types'

interface RestrictedAccountBannerProps {
  status: UserStatus
}

const statusConfig: Record<
  'INACTIVE' | 'BLOCKED',
  {
    icon: typeof AlertTriangle
    title: string
    message: string
    color: string
    bgColor: string
  }
> = {
  INACTIVE: {
    icon: AlertTriangle,
    title: 'Cuenta Desactivada',
    message:
      'Tu cuenta ha sido desactivada temporalmente. Esto puede deberse a pagos pendientes o falta de inscripciones activas.',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  BLOCKED: {
    icon: Ban,
    title: 'Cuenta Bloqueada',
    message:
      'Tu cuenta ha sido bloqueada por un administrador. Por favor, contacta con el centro para más información.',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
}

export function RestrictedAccountBanner({ status }: RestrictedAccountBannerProps) {
  const { user, clearAuth } = useAuthStore()

  if (status !== 'INACTIVE' && status !== 'BLOCKED') {
    return null
  }

  const config = statusConfig[status]
  const Icon = config.icon

  const handleLogout = () => {
    clearAuth()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className={`rounded-lg border-2 p-8 ${config.bgColor}`}>
          <div className="flex flex-col items-center text-center">
            <div className={`rounded-full p-4 ${config.bgColor} mb-4`}>
              <Icon className={`h-12 w-12 ${config.color}`} />
            </div>

            <h1 className={`text-2xl font-bold ${config.color} mb-2`}>
              {config.title}
            </h1>

            <p className="text-gray-600 mb-6">{config.message}</p>

            {user && (
              <div className="w-full bg-white rounded-lg p-4 mb-6 border">
                <p className="text-sm text-gray-500 mb-1">Sesión iniciada como:</p>
                <p className="font-medium text-gray-900">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            )}

            <div className="w-full space-y-3">
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Contacta con el centro:
                </p>
                <div className="space-y-2">
                  <a
                    href="tel:+34953123456"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Phone className="h-4 w-4" />
                    +34 953 123 456
                  </a>
                  <a
                    href="mailto:info@acainfo.com"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Mail className="h-4 w-4" />
                    info@acainfo.com
                  </a>
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

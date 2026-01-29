import { AlertCircle, RefreshCw, WifiOff, Lock, ServerCrash, FileQuestion, ShieldX } from 'lucide-react'

interface ErrorStateProps {
  error: Error | unknown
  onRetry?: () => void
  title?: string
}

interface ErrorInfo {
  message: string
  icon: React.ReactNode
}

function getErrorInfo(error: unknown): ErrorInfo {
  const iconClass = 'h-5 w-5 text-red-600 flex-shrink-0'

  if (error instanceof Error) {
    const message = error.message.toLowerCase()

    if (message.includes('network') || message.includes('fetch') || message.includes('econnrefused')) {
      return {
        message: 'Error de conexion. Verifica tu internet e intenta de nuevo.',
        icon: <WifiOff className={iconClass} />,
      }
    }

    if (message.includes('401') || message.includes('unauthorized')) {
      return {
        message: 'Tu sesion ha expirado. Por favor, inicia sesion nuevamente.',
        icon: <Lock className={iconClass} />,
      }
    }

    if (message.includes('403') || message.includes('forbidden')) {
      return {
        message: 'No tienes permisos para realizar esta accion.',
        icon: <ShieldX className={iconClass} />,
      }
    }

    if (message.includes('404') || message.includes('not found')) {
      return {
        message: 'El recurso solicitado no existe o fue eliminado.',
        icon: <FileQuestion className={iconClass} />,
      }
    }

    if (message.includes('400') || message.includes('bad request')) {
      return {
        message: 'Datos invalidos. Revisa la informacion ingresada.',
        icon: <AlertCircle className={iconClass} />,
      }
    }

    if (message.includes('500') || message.includes('server')) {
      return {
        message: 'Error del servidor. Por favor, intenta mas tarde.',
        icon: <ServerCrash className={iconClass} />,
      }
    }

    if (message.includes('timeout')) {
      return {
        message: 'La solicitud tardo demasiado. Intenta de nuevo.',
        icon: <WifiOff className={iconClass} />,
      }
    }
  }

  return {
    message: 'Ocurrio un error inesperado. Por favor, intenta de nuevo.',
    icon: <AlertCircle className={iconClass} />,
  }
}

export function ErrorState({ error, onRetry, title = 'Error' }: ErrorStateProps) {
  const { message, icon } = getErrorInfo(error)

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-800"
            >
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

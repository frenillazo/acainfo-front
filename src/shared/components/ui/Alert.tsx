import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

const alertVariants = cva('rounded-md p-4', {
  variants: {
    variant: {
      error: 'bg-red-50 text-red-800',
      warning: 'bg-yellow-50 text-yellow-800',
      success: 'bg-green-50 text-green-800',
      info: 'bg-blue-50 text-blue-800',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
})

const iconMap = {
  error: XCircle,
  warning: AlertCircle,
  success: CheckCircle,
  info: Info,
}

const iconColorMap = {
  error: 'text-red-500',
  warning: 'text-yellow-500',
  success: 'text-green-500',
  info: 'text-blue-500',
}

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>

interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: string
  message: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function Alert({
  variant = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const Icon = iconMap[variant!]

  return (
    <div className={cn(alertVariants({ variant }), className)} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', iconColorMap[variant!])} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <p className={cn('text-sm', title && 'mt-1')}>{message}</p>
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onDismiss}
              className={cn(
                'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                variant === 'error' &&
                  'text-red-500 hover:bg-red-100 focus:ring-red-600',
                variant === 'warning' &&
                  'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
                variant === 'success' &&
                  'text-green-500 hover:bg-green-100 focus:ring-green-600',
                variant === 'info' &&
                  'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
              )}
            >
              <span className="sr-only">Cerrar</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export { alertVariants }

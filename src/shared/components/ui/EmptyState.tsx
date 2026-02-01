import { cn } from '@/shared/utils/cn'
import { Inbox } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  message?: string
  description?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  message = 'No se encontraron resultados',
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-gray-50 p-8 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        {icon || <Inbox className="h-6 w-6 text-gray-400" aria-hidden="true" />}
      </div>
      <p className="mt-4 text-sm font-medium text-gray-900">{message}</p>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          <Button variant="primary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}

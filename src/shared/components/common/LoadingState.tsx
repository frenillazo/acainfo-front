import { Spinner } from '../ui/Spinner'
import { cn } from '@/shared/utils/cn'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullHeight?: boolean
  className?: string
}

export function LoadingState({
  message,
  size = 'md',
  fullHeight = true,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullHeight && 'h-64',
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size={size} />
        {message && (
          <p className="text-sm text-gray-500">{message}</p>
        )}
      </div>
    </div>
  )
}

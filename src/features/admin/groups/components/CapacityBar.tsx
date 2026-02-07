import { cn } from '@/shared/utils/cn'

interface CapacityBarProps {
  current: number
  max: number
}

export function CapacityBar({ current, max }: CapacityBarProps) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0
  const available = max - current

  const barColor =
    current >= max
      ? 'bg-red-500'
      : percentage >= 80
        ? 'bg-amber-500'
        : 'bg-green-500'

  return (
    <div className="space-y-1">
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className={cn(current >= max && 'font-medium text-red-600')}>
          {current} / {max}
        </span>
        {available > 0 ? (
          <span>({available} disponible{available !== 1 ? 's' : ''})</span>
        ) : (
          <span className="font-medium text-red-600">Lleno</span>
        )}
      </div>
    </div>
  )
}

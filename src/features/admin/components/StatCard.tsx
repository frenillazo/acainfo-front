import { cn } from '@/shared/utils/cn'
import { Card } from '@/shared/components/ui'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'gray'
  subtitle?: string
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  purple: 'bg-purple-50 text-purple-600',
  red: 'bg-red-50 text-red-600',
  gray: 'bg-gray-50 text-gray-600',
}

export function StatCard({ title, value, icon, color = 'blue', subtitle }: StatCardProps) {
  return (
    <Card padding="md">
      <div className="flex items-center gap-4">
        <div className={cn('rounded-lg p-3', colorClasses[color])}>
          {icon}
        </div>
        {/* El valor pesaba lo mismo que el h1 de la página (24px/700): en una
            pantalla cuyo trabajo es que los números salten a la vista, nada
            destacaba porque todo destacaba igual. */}
        <div className="flex-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold tabular-nums text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
    </Card>
  )
}

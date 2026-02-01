import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { Card } from '@/shared/components/ui'

interface QuickActionCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'purple'
}

const colorClasses = {
  blue: 'hover:border-blue-300 hover:bg-blue-50',
  green: 'hover:border-green-300 hover:bg-green-50',
  yellow: 'hover:border-yellow-300 hover:bg-yellow-50',
  purple: 'hover:border-purple-300 hover:bg-purple-50',
}

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  purple: 'text-purple-600',
}

export function QuickActionCard({
  title,
  description,
  href,
  icon,
  color = 'blue',
}: QuickActionCardProps) {
  return (
    <Link to={href}>
      <Card padding="sm" className={cn('transition-colors', colorClasses[color])}>
        <div className="flex items-start gap-3">
          <div className={cn('mt-0.5', iconColorClasses[color])}>{icon}</div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

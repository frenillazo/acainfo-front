import type { Degree } from '../../types/admin.types'

interface DegreeBadgeProps {
  degree: Degree
}

const degreeConfig: Record<Degree, { label: string; className: string }> = {
  INGENIERIA_INFORMATICA: {
    label: 'Ing. Informática',
    className: 'bg-blue-100 text-blue-800',
  },
  INGENIERIA_INDUSTRIAL: {
    label: 'Ing. Industrial',
    className: 'bg-purple-100 text-purple-800',
  },
}

export function DegreeBadge({ degree }: DegreeBadgeProps) {
  const config = degreeConfig[degree]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}

import type { Classroom } from '../../types/admin.types'

interface ClassroomBadgeProps {
  classroom: Classroom
}

const classroomConfig: Record<Classroom, { label: string; className: string }> = {
  AULA_PORTAL1: {
    label: 'Aula Portal 1',
    className: 'bg-blue-100 text-blue-800',
  },
  AULA_PORTAL2: {
    label: 'Aula Portal 2',
    className: 'bg-green-100 text-green-800',
  },
  AULA_VIRTUAL: {
    label: 'Aula Virtual',
    className: 'bg-purple-100 text-purple-800',
  },
}

export function ClassroomBadge({ classroom }: ClassroomBadgeProps) {
  const config = classroomConfig[classroom]

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}

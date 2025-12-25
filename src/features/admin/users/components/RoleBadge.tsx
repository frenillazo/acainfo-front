import { cn } from '@/shared/utils/cn'

interface RoleBadgeProps {
  role: string
}

const roleConfig: Record<string, { label: string; className: string }> = {
  ADMIN: {
    label: 'Admin',
    className: 'bg-purple-100 text-purple-800',
  },
  TEACHER: {
    label: 'Profesor',
    className: 'bg-blue-100 text-blue-800',
  },
  STUDENT: {
    label: 'Estudiante',
    className: 'bg-green-100 text-green-800',
  },
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role] ?? {
    label: role,
    className: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        config.className
      )}
    >
      {config.label}
    </span>
  )
}

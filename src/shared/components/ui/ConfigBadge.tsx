import { Badge, type BadgeVariant } from './Badge'

export interface BadgeConfigEntry {
  label: string
  variant: BadgeVariant
  /** Icono de lucide (el componente, no JSX): antes esto era un emoji. */
  icon?: React.ComponentType<{ className?: string }>
}

interface ConfigBadgeProps<T extends string> {
  config: Record<T, BadgeConfigEntry>
  value: T
  fallback?: T
  className?: string
}

export function ConfigBadge<T extends string>({
  config,
  value,
  fallback,
  className,
}: ConfigBadgeProps<T>) {
  const entry = config[value] ?? (fallback ? config[fallback] : undefined)
  if (!entry) return null

  const Icon = entry.icon

  return (
    <Badge variant={entry.variant} className={className}>
      {Icon && <Icon className="mr-1 h-3.5 w-3.5" />}
      {entry.label}
    </Badge>
  )
}

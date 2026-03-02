import { Badge, type BadgeVariant } from './Badge'

export interface BadgeConfigEntry {
  label: string
  variant: BadgeVariant
  icon?: string
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

  return (
    <Badge variant={entry.variant} className={className}>
      {entry.icon && <span className="mr-1">{entry.icon}</span>}
      {entry.label}
    </Badge>
  )
}

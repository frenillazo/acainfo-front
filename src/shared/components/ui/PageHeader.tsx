import { cn } from '@/shared/utils/cn'

interface PageHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Botones o enlaces alineados a la derecha del título. */
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  const heading = (
    <>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
    </>
  )

  if (!actions) {
    return <div className={className}>{heading}</div>
  }

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <div>{heading}</div>
      <div className="flex shrink-0 items-center gap-3">{actions}</div>
    </div>
  )
}

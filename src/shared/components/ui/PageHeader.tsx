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

  // Responsive: en móvil apila el título y las acciones (flex-col); en sm+ vuelve
  // a la fila con las acciones a la derecha. En sm+ esto resuelve exactamente a
  // `flex items-center justify-between gap-4`, así que el escritorio no cambia.
  // `flex-wrap` en las acciones evita que un grupo ancho (toggle + botón)
  // desborde al apilarse; en escritorio no aplica (la caja es de su contenido).
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      <div>{heading}</div>
      <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>
    </div>
  )
}

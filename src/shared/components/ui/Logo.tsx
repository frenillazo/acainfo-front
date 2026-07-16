import { cn } from '@/shared/utils/cn'

const SIZES = {
  sm: { img: 'h-8 w-8', text: 'text-xl' },
  md: { img: 'h-14 w-14', text: 'text-2xl' },
  lg: { img: 'h-20 w-20', text: 'text-3xl' },
} as const

interface LogoProps {
  size?: keyof typeof SIZES
  /** Apila logo y nombre en vertical (portada de las páginas de auth). */
  stacked?: boolean
  className?: string
}

/**
 * El wordmark, en un solo sitio.
 *
 * Tenía tres tratamientos incompatibles: sans azul en la landing, Playfair
 * Display serif en el sidebar y Playfair a otro tamaño en las páginas de auth
 * (con `style` inline en 7 ficheros). Playfair, además, se cargaba del CDN de
 * Google en cada visita: bloqueaba el render y enviaba la IP de cada alumno a
 * Google. Retirada el 16-jul-2026 por decisión del dueño; se conserva el
 * tratamiento de la landing, que ya era el que veía todo el mundo primero.
 */
export function Logo({ size = 'md', stacked = false, className }: LogoProps) {
  const { img, text } = SIZES[size]

  return (
    <span
      className={cn(
        'flex items-center gap-3',
        stacked && 'flex-col gap-3',
        className
      )}
    >
      <img src="/logo.png" alt="" className={cn(img, 'object-contain')} aria-hidden="true" />
      <span className={cn(text, 'font-bold tracking-tight text-blue-600')}>AcaInfo</span>
    </span>
  )
}

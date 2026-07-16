import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Atrapa el foco dentro de un diálogo mientras está abierto, lo lleva dentro al
 * abrir y lo devuelve al disparador al cerrar.
 *
 * Sin esto, un modal solo "bloquea" el ratón: con el teclado se tabula hacia la
 * página de fondo y se opera con normalidad — incluido el modal de T&C, que es
 * bloqueante por diseño.
 *
 * El contenedor debe tener `tabIndex={-1}` para poder recibir el foco cuando no
 * hay nada enfocable dentro.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))

    // Foco inicial dentro del diálogo (si no hay nada enfocable, el contenedor).
    const first = focusables()[0]
    ;(first ?? container).focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      const items = focusables()
      if (items.length === 0) {
        event.preventDefault()
        return
      }

      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      const current = document.activeElement

      // Fuera del diálogo (o en los extremos): reciclar dentro.
      if (event.shiftKey && (current === firstItem || !container.contains(current))) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && (current === lastItem || !container.contains(current))) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Devolver el foco a quien abrió el diálogo; si ya no existe, no hay nada
      // que hacer y el navegador lo manda al body.
      previouslyFocused?.focus?.()
    }
  }, [active])

  return containerRef
}

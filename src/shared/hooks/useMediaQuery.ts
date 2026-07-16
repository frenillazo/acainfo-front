import { useCallback, useSyncExternalStore } from 'react'

/**
 * Suscripción a una media query. Para lo que las clases de Tailwind no pueden
 * hacer: decidir *atributos* según el viewport (p.ej. marcar `inert` el sidebar
 * cerrado solo en móvil, porque en escritorio siempre está visible) o parar un
 * intervalo si el usuario pide menos movimiento.
 *
 * Con useSyncExternalStore en vez de useState+useEffect: matchMedia ES un store
 * externo, y así no hay un render con el valor equivocado antes del efecto.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQuery = window.matchMedia?.(query)
      if (!mediaQuery) return () => {}
      mediaQuery.addEventListener('change', onStoreChange)
      return () => mediaQuery.removeEventListener('change', onStoreChange)
    },
    [query]
  )

  const getSnapshot = useCallback(() => window.matchMedia?.(query).matches ?? false, [query])

  return useSyncExternalStore(subscribe, getSnapshot)
}

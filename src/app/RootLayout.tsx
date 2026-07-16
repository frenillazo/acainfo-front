import { Outlet, useNavigation } from 'react-router-dom'
import { useDocumentTitle } from './useDocumentTitle'

/**
 * Barra de progreso mientras el router resuelve la ruta siguiente. Las rutas son
 * lazy: sin esto, pulsar un enlace a un chunk que aún no está descargado deja la
 * página vieja congelada y el usuario vuelve a pulsar.
 *
 * Solo visual (aria-hidden): el cambio de título ya anuncia la navegación a los
 * lectores de pantalla, y una región live aquí interrumpiría en cada clic.
 */
function NavigationProgress() {
  const navigation = useNavigation()
  if (navigation.state === 'idle') return null

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-blue-100" aria-hidden="true">
      <div className="h-full w-full animate-pulse bg-blue-600" />
    </div>
  )
}

export function RootLayout() {
  useDocumentTitle()

  return (
    <>
      <NavigationProgress />
      <Outlet />
    </>
  )
}

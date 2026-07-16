import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  // El scroll vive en este <main>, que sobrevive al cambio de ruta: sin esto,
  // abrir un detalle desde el fondo de una lista larga te deja a media página.
  // `ScrollRestoration` de React Router no sirve aquí (gestiona el de window).
  // En POP (atrás/adelante) no se toca: el navegador restaura su posición.
  useEffect(() => {
    if (navigationType !== 'POP') {
      mainRef.current?.scrollTo(0, 0)
    }
  }, [pathname, navigationType])

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} menuOpen={sidebarOpen} />

        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

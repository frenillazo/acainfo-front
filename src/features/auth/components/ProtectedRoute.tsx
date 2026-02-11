import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { RestrictedAccountBanner } from './RestrictedAccountBanner'
import { TermsAcceptanceModal } from './TermsAcceptanceModal'
import type { RoleType } from '../types/auth.types'

interface ProtectedRouteProps {
  roles?: RoleType[]
  children?: React.ReactNode
  /** Si true, permite acceso aunque el usuario esté INACTIVE/BLOCKED (ej: página de perfil) */
  allowRestricted?: boolean
}

export function ProtectedRoute({ roles, children, allowRestricted = false }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, hasRole, user, termsAccepted } = useAuthStore()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Verificar si el usuario tiene cuenta restringida (INACTIVE o BLOCKED)
  // Solo mostrar banner si no está en una ruta permitida
  if (!allowRestricted && user && (user.status === 'INACTIVE' || user.status === 'BLOCKED')) {
    return <RestrictedAccountBanner status={user.status} />
  }

  // Verificar si el usuario ha aceptado los términos y condiciones vigentes
  if (termsAccepted === false) {
    return (
      <>
        <TermsAcceptanceModal />
        {children ? <>{children}</> : <Outlet />}
      </>
    )
  }

  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some((role) => hasRole(role))
    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children ? <>{children}</> : <Outlet />
}

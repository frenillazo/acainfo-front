import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { RoleType } from '../types/auth.types'

interface ProtectedRouteProps {
  roles?: RoleType[]
  children?: React.ReactNode
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, hasRole } = useAuthStore()

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.some((role) => hasRole(role))
    if (!hasRequiredRole) {
      return <Navigate to="/dashboard" replace />
    }
  }

  return children ? <>{children}</> : <Outlet />
}

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAdminUser } from '../hooks/useAdminUsers'
import { RoleBadge } from '../components/RoleBadge'
import { ConfigBadge } from '@/shared/components/ui'
import { USER_STATUS_CONFIG } from '@/shared/config/badgeConfig'
import { RoleManagementPanel } from '@/features/auth/components/RoleManagementPanel'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import type { User } from '@/features/auth'
import { formatDateTimeLong } from '@/shared/utils/formatters'

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const userId = id ? parseInt(id, 10) : 0

  const { data: userData, isLoading, error, refetch } = useAdminUser(userId)
  const [user, setUser] = useState<User | null>((userData as User) || null)

  // Update local state when data changes
  if (userData && user?.id !== userData.id) {
    setUser(userData as User)
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUser(updatedUser)
    refetch()
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !user) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a usuarios
        </Link>
        <ErrorState error={error} title="Error al cargar el usuario" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs
        homeHref="/admin"
        items={[
          { label: 'Usuarios', href: '/admin/users' },
          { label: user.fullName },
        ]}
      />

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-medium text-gray-600">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.fullName}
              </h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* La gestión de inscripciones es el uso principal de la app, pero
                desde la ficha del alumno no había camino (el inverso sí existe). */}
            <Link
              to={`/admin/enrollments?studentEmail=${encodeURIComponent(user.email)}`}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Ver inscripciones
            </Link>
            <ConfigBadge config={USER_STATUS_CONFIG} value={user.status} fallback="PENDING_ACTIVATION" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información del Usuario
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.firstName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Apellidos</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {user.phoneNumber || <span className="text-gray-400">No especificado</span>}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <ConfigBadge config={USER_STATUS_CONFIG} value={user.status} fallback="PENDING_ACTIVATION" />
              </dd>
            </div>
          </dl>
        </div>

        {/* Roles & Dates */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Roles</h2>
            <div className="flex flex-wrap gap-2">
              {user.roles.map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Fechas</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Fecha de creación
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDateTimeLong(user.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Última actualización
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDateTimeLong(user.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Role Management Panel (ADMIN ONLY) */}
      <RoleManagementPanel user={user} onUserUpdated={handleUserUpdated} />
    </div>
  )
}

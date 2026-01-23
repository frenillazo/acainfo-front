import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAdminUser } from '../hooks/useAdminUsers'
import { UserStatusBadge } from '../components/UserStatusBadge'
import { RoleBadge } from '../components/RoleBadge'
import { RoleManagementPanel } from '@/features/auth/components/RoleManagementPanel'
import type { User } from '@/features/auth'

export function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const userId = id ? parseInt(id, 10) : 0

  const { data: userData, isLoading, error, refetch } = useAdminUser(userId)
  const [user, setUser] = useState<User | null>(userData || null)

  // Update local state when data changes
  if (userData && user?.id !== userData.id) {
    setUser(userData)
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUser(updatedUser)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
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
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          Error al cargar el usuario. Por favor, intenta de nuevo.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/admin/users"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← Volver a usuarios
      </Link>

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
          <UserStatusBadge status={user.status} />
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
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <UserStatusBadge status={user.status} />
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
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Última actualización
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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

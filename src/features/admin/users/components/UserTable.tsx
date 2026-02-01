import { Link } from 'react-router-dom'
import type { User } from '../../types/admin.types'
import { UserStatusBadge } from './UserStatusBadge'
import { RoleBadge } from './RoleBadge'

type SelectionMode = 'none' | 'deactivate' | 'activate'

interface UserTableProps {
  users: User[]
  selectedUserIds?: number[]
  onSelectionChange?: (userIds: number[]) => void
  showSelection?: boolean
  selectionMode?: SelectionMode
}

export function UserTable({
  users,
  selectedUserIds = [],
  onSelectionChange,
  showSelection = false,
  selectionMode = 'deactivate',
}: UserTableProps) {
  const isUserSelectable = (user: User) => {
    if (selectionMode === 'deactivate') {
      // For deactivation: only ACTIVE users without ADMIN role
      return user.status === 'ACTIVE' && !user.roles.includes('ADMIN')
    } else if (selectionMode === 'activate') {
      // For activation: only INACTIVE users
      return user.status === 'INACTIVE'
    }
    return false
  }

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      const selectableIds = users
        .filter(isUserSelectable)
        .map((u) => u.id)
      onSelectionChange(selectableIds)
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange([...selectedUserIds, userId])
    } else {
      onSelectionChange(selectedUserIds.filter((id) => id !== userId))
    }
  }

  const selectableUsers = users.filter(isUserSelectable)
  const allSelectableSelected =
    selectableUsers.length > 0 &&
    selectableUsers.every((u) => selectedUserIds.includes(u.id))

  const getSelectionTitle = (user: User, selectable: boolean) => {
    if (selectable) return undefined
    if (selectionMode === 'deactivate') {
      if (user.roles.includes('ADMIN')) {
        return 'Los usuarios admin no pueden ser desactivados'
      }
      return 'Solo usuarios activos pueden ser desactivados'
    } else if (selectionMode === 'activate') {
      return 'Solo usuarios inactivos pueden ser activados'
    }
    return undefined
  }

  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        No se encontraron usuarios
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showSelection && (
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={allSelectableSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  title={`Seleccionar todos los usuarios ${selectionMode === 'activate' ? 'inactivos' : 'activos'}`}
                />
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Usuario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Roles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Creado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => {
            const selectable = isUserSelectable(user)
            const isSelected = selectedUserIds.includes(user.id)

            return (
              <tr
                key={user.id}
                className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
              >
                {showSelection && (
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                      checked={isSelected}
                      disabled={!selectable}
                      onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                      title={getSelectionTitle(user, selectable)}
                    />
                  </td>
                )}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{user.fullName}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

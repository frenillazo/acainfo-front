import { useState } from 'react'
import type { User, RoleType, UserStatus } from '../types/auth.types'
import { adminApi } from '../services/adminApi'
import { cn } from '@/shared/utils/cn'

interface RoleManagementPanelProps {
  user: User
  onUserUpdated: (user: User) => void
}

export function RoleManagementPanel({ user, onUserUpdated }: RoleManagementPanelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const hasRole = (role: RoleType) => user.roles.includes(role)
  const isOnlyStudent = user.roles.length === 1 && user.roles.includes('STUDENT')

  const handleAssignRole = async (roleType: RoleType) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const updatedUser = await adminApi.assignRole(user.id, roleType)
      onUserUpdated(updatedUser)
      setSuccessMessage(`Role ${roleType} assigned successfully`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      const message = err.response?.data?.message || `Failed to assign role ${roleType}`
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevokeRole = async (roleType: RoleType) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const updatedUser = await adminApi.revokeRole(user.id, roleType)
      onUserUpdated(updatedUser)
      setSuccessMessage(`Role ${roleType} revoked successfully`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      const message = err.response?.data?.message || `Failed to revoke role ${roleType}`
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (status: UserStatus) => {
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const updatedUser = await adminApi.updateStatus(user.id, status)
      onUserUpdated(updatedUser)
      setSuccessMessage(`Status updated to ${status} successfully`)
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      const message = err.response?.data?.message || `Failed to update status to ${status}`
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
              >
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Management */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Role Management</h3>

        <div className="space-y-4">
          {/* ADMIN Role */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Administrator</h4>
              <p className="text-sm text-gray-500">
                Full system access and user management
              </p>
            </div>
            {hasRole('ADMIN') ? (
              <button
                onClick={() => handleRevokeRole('ADMIN')}
                disabled={isLoading || user.roles.length <= 1}
                className={cn(
                  'rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white',
                  'hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                Remove Admin
              </button>
            ) : (
              <button
                onClick={() => handleAssignRole('ADMIN')}
                disabled={isLoading || isOnlyStudent}
                className={cn(
                  'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white',
                  'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                Assign Admin
              </button>
            )}
          </div>

          {/* TEACHER Role */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <div>
              <h4 className="font-medium text-gray-900">Teacher</h4>
              <p className="text-sm text-gray-500">
                Can manage courses, sessions, and materials
              </p>
            </div>
            {hasRole('TEACHER') ? (
              <button
                onClick={() => handleRevokeRole('TEACHER')}
                disabled={isLoading || user.roles.length <= 1}
                className={cn(
                  'rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white',
                  'hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                Remove Teacher
              </button>
            ) : (
              <button
                onClick={() => handleAssignRole('TEACHER')}
                disabled={isLoading || isOnlyStudent}
                className={cn(
                  'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white',
                  'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                Assign Teacher
              </button>
            )}
          </div>

          {user.roles.length <= 1 && !isOnlyStudent && (
            <p className="text-xs text-gray-500">
              Note: Users must have at least one role. Cannot remove last role.
            </p>
          )}

          {isOnlyStudent && (
            <p className="text-xs text-amber-600 mt-2">
              Nota: Los usuarios con rol de estudiante no pueden recibir roles de administrador o profesor.
            </p>
          )}
        </div>
      </div>

      {/* Status Management */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Status</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Current status:{' '}
                <span
                  className={cn(
                    'font-semibold',
                    user.status === 'ACTIVE' && 'text-green-600',
                    user.status === 'BLOCKED' && 'text-red-600',
                    user.status === 'INACTIVE' && 'text-gray-600'
                  )}
                >
                  {user.status}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleUpdateStatus('ACTIVE')}
              disabled={isLoading || user.status === 'ACTIVE'}
              className={cn(
                'flex-1 rounded-md px-4 py-2 text-sm font-medium',
                user.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'border border-green-600 text-green-600 hover:bg-green-50',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              Active
            </button>

            <button
              onClick={() => handleUpdateStatus('BLOCKED')}
              disabled={isLoading || user.status === 'BLOCKED'}
              className={cn(
                'flex-1 rounded-md px-4 py-2 text-sm font-medium',
                user.status === 'BLOCKED'
                  ? 'bg-red-100 text-red-800'
                  : 'border border-red-600 text-red-600 hover:bg-red-50',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              Blocked
            </button>

            <button
              onClick={() => handleUpdateStatus('INACTIVE')}
              disabled={isLoading || user.status === 'INACTIVE'}
              className={cn(
                'flex-1 rounded-md px-4 py-2 text-sm font-medium',
                user.status === 'INACTIVE'
                  ? 'bg-gray-100 text-gray-800'
                  : 'border border-gray-600 text-gray-600 hover:bg-gray-50',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

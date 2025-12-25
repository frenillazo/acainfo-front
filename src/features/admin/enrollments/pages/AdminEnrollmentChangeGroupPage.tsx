import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  useAdminEnrollment,
  useChangeEnrollmentGroup,
} from '../hooks/useAdminEnrollments'
import { adminApi } from '../../services/adminApi'
import { cn } from '@/shared/utils/cn'

export function AdminEnrollmentChangeGroupPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const enrollmentId = id ? parseInt(id, 10) : 0

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [groupSearch, setGroupSearch] = useState('')

  const { data: enrollment, isLoading: isLoadingEnrollment } = useAdminEnrollment(enrollmentId)
  const { mutate: changeGroup, isPending, error } = useChangeEnrollmentGroup()

  // Fetch groups
  const { data: groupsData, isLoading: isLoadingGroups } = useQuery({
    queryKey: ['admin', 'groups', { size: 100 }],
    queryFn: () => adminApi.getGroups({ size: 100 }),
  })

  const groups = groupsData?.content ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroupId) return

    changeGroup(
      { id: enrollmentId, data: { newGroupId: selectedGroupId } },
      {
        onSuccess: () => {
          navigate(`/admin/enrollments/${enrollmentId}`)
        },
      }
    )
  }

  const handleCancel = () => {
    navigate(`/admin/enrollments/${enrollmentId}`)
  }

  if (isLoadingEnrollment) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/enrollments"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a inscripciones
        </Link>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          Error al cargar la inscripción.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to={`/admin/enrollments/${enrollmentId}`}
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← Volver al detalle
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cambiar Grupo</h1>
        <p className="mt-1 text-sm text-gray-500">
          Cambiar grupo para la inscripción de {enrollment.studentName} en{' '}
          {enrollment.subjectName}
        </p>
      </div>

      {/* Current Group Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700">Grupo actual</h3>
        <p className="mt-1 text-gray-900">
          {enrollment.subjectName} - {enrollment.groupType}
        </p>
        <p className="text-sm text-gray-500">Profesor: {enrollment.teacherName}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="groupSearch"
            className="block text-sm font-medium text-gray-700"
          >
            Nuevo Grupo
          </label>
          <input
            type="text"
            id="groupSearch"
            placeholder="Buscar grupo..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={groupSearch}
            onChange={(e) => setGroupSearch(e.target.value)}
          />
          <div className="mt-2 max-h-64 overflow-y-auto rounded-md border border-gray-200">
            {isLoadingGroups ? (
              <div className="p-3 text-center text-sm text-gray-500">Cargando...</div>
            ) : groups.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500">
                No se encontraron grupos
              </div>
            ) : (
              groups
                .filter((group) => group.id !== enrollment.groupId)
                .filter((group) =>
                  groupSearch
                    ? group.subjectName?.toLowerCase().includes(groupSearch.toLowerCase()) ||
                      group.type?.toLowerCase().includes(groupSearch.toLowerCase())
                    : true
                )
                .map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedGroupId(group.id)}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50',
                      selectedGroupId === group.id && 'bg-blue-50 text-blue-700'
                    )}
                  >
                    <div>
                      <div className="font-medium">
                        {group.subjectName} - {group.type}
                      </div>
                      <div className="text-gray-500">
                        Profesor: {group.teacherName} | Capacidad:{' '}
                        {group.currentEnrollments}/{group.maxCapacity}
                      </div>
                    </div>
                    {selectedGroupId === group.id && (
                      <span className="text-blue-600">✓</span>
                    )}
                  </button>
                ))
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-700">
              {error.message || 'Error al cambiar de grupo'}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || !selectedGroupId}
            className={cn(
              'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isPending ? 'Cambiando...' : 'Cambiar grupo'}
          </button>
        </div>
      </form>
    </div>
  )
}

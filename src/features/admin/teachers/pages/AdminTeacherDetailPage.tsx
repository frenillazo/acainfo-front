import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAdminTeacher, useDeleteTeacher } from '../hooks/useAdminTeachers'
import { UserStatusBadge } from '../../users/components/UserStatusBadge'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'

export function AdminTeacherDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const teacherId = id ? parseInt(id, 10) : 0

  const { data: teacher, isLoading, error } = useAdminTeacher(teacherId)
  const deleteMutation = useDeleteTeacher()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Eliminar profesor',
      message: '¿Estás seguro de que quieres eliminar este profesor?',
      confirmLabel: 'Sí, eliminar',
      variant: 'danger',
    })
    if (confirmed) {
      deleteMutation.mutate(teacherId, {
        onSuccess: () => {
          navigate('/admin/teachers')
        },
      })
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error || !teacher) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/teachers"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a profesores
        </Link>
        <ErrorState error={error} title="Error al cargar el profesor" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumbs
        homeHref="/admin"
        items={[
          { label: 'Profesores', href: '/admin/teachers' },
          { label: teacher.fullName },
        ]}
      />

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-medium text-blue-600">
              {teacher.firstName[0]}
              {teacher.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {teacher.fullName}
              </h1>
              <p className="text-gray-500">{teacher.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserStatusBadge status={teacher.status} />
            <Link
              to={`/admin/teachers/${teacher.id}/edit`}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Editar
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Teacher Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información del Profesor
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{teacher.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-sm text-gray-900">{teacher.firstName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Apellidos</dt>
              <dd className="mt-1 text-sm text-gray-900">{teacher.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{teacher.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <UserStatusBadge status={teacher.status} />
              </dd>
            </div>
          </dl>
        </div>

        {/* Dates */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Fechas</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Fecha de creación
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(teacher.createdAt).toLocaleDateString('es-ES', {
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
                {new Date(teacher.updatedAt).toLocaleDateString('es-ES', {
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

      <ConfirmDialog {...dialogProps} isLoading={deleteMutation.isPending} />
    </div>
  )
}

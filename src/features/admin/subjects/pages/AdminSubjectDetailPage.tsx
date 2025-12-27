import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  useAdminSubject,
  useArchiveSubject,
  useDeleteSubject,
} from '../hooks/useAdminSubjects'
import { SubjectStatusBadge } from '../components/SubjectStatusBadge'
import { DegreeBadge } from '../components/DegreeBadge'

export function AdminSubjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const subjectId = id ? parseInt(id, 10) : 0

  const { data: subject, isLoading, error } = useAdminSubject(subjectId)
  const archiveMutation = useArchiveSubject()
  const deleteMutation = useDeleteSubject()

  const handleArchive = () => {
    if (window.confirm('¿Estás seguro de que quieres archivar esta asignatura?')) {
      archiveMutation.mutate(subjectId)
    }
  }

  const handleDelete = () => {
    if (
      window.confirm(
        '¿Estás seguro de que quieres eliminar esta asignatura? Esta acción no se puede deshacer.'
      )
    ) {
      deleteMutation.mutate(subjectId, {
        onSuccess: () => {
          navigate('/admin/subjects')
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  if (error || !subject) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/subjects"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a asignaturas
        </Link>
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          Error al cargar la asignatura. Por favor, intenta de nuevo.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/admin/subjects"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← Volver a asignaturas
      </Link>

      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {subject.name}
              </h1>
              <SubjectStatusBadge status={subject.status} />
            </div>
            <p className="mt-1 font-mono text-gray-500">{subject.code}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={`/admin/subjects/${subject.id}/edit`}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Editar
            </Link>
            {subject.status !== 'ARCHIVED' && (
              <button
                onClick={handleArchive}
                disabled={archiveMutation.isPending}
                className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
              >
                {archiveMutation.isPending ? 'Archivando...' : 'Archivar'}
              </button>
            )}
            {subject.currentGroupCount === 0 && (
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Información de la Asignatura
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{subject.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Código</dt>
              <dd className="mt-1 font-mono text-sm text-gray-900">
                {subject.code}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Nombre</dt>
              <dd className="mt-1 text-sm text-gray-900">{subject.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Nombre completo
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {subject.displayName}
              </dd>
            </div>
          </dl>
        </div>

        {/* Degree & Status */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Grado y Estado
          </h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Grado</dt>
              <dd className="mt-1">
                <DegreeBadge degree={subject.degree} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <SubjectStatusBadge status={subject.status} />
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                ¿Puede crear grupos?
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {subject.canCreateGroup ? (
                  <span className="text-green-600">Sí</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Groups Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Grupos</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Número de grupos
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {subject.currentGroupCount}
              </dd>
            </div>
            {subject.currentGroupCount > 0 && (
              <div className="pt-2">
                <Link
                  to={`/admin/groups?subjectId=${subject.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Ver grupos de esta asignatura →
                </Link>
              </div>
            )}
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
                {new Date(subject.createdAt).toLocaleDateString('es-ES', {
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
                {new Date(subject.updatedAt).toLocaleDateString('es-ES', {
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
  )
}

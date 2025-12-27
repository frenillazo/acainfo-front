import { useNavigate, useParams } from 'react-router-dom'
import { SubjectForm } from '../components/SubjectForm'
import { useAdminSubject, useUpdateSubject } from '../hooks/useAdminSubjects'
import type { UpdateSubjectRequest } from '../../types/admin.types'

export function AdminSubjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const subjectId = Number(id)

  const { data: subject, isLoading, error: loadError } = useAdminSubject(subjectId)
  const { mutate: updateSubject, isPending, error: updateError } = useUpdateSubject()

  const handleSubmit = (data: UpdateSubjectRequest) => {
    updateSubject(
      { id: subjectId, data },
      {
        onSuccess: () => {
          navigate(`/admin/subjects/${subjectId}`)
        },
      }
    )
  }

  const handleCancel = () => {
    navigate(`/admin/subjects/${subjectId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando asignatura...</div>
      </div>
    )
  }

  if (loadError || !subject) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">Error al cargar la asignatura</p>
        <button
          onClick={() => navigate('/admin/subjects')}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800"
        >
          Volver al listado
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Asignatura</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modifica el nombre o estado de {subject.code} - {subject.name}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <SubjectForm
          subject={subject}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={updateError}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

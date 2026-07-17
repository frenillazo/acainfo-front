import { useNavigate, useParams } from 'react-router-dom'
import { Card, PageHeader } from '@/shared/components/ui'
import { SubjectForm, type UpdateSubjectFormData } from '../components/SubjectForm'
import { useAdminSubject, useUpdateSubject } from '../hooks/useAdminSubjects'
import type { UpdateSubjectRequest } from '../../types/admin.types'

export function AdminSubjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const subjectId = Number(id)

  const { data: subject, isLoading, error: loadError } = useAdminSubject(subjectId)
  const { mutate: updateSubject, isPending, error: updateError } = useUpdateSubject()

  const handleSubmit = (formData: UpdateSubjectFormData) => {
    // year null = "Sin asignar": la API lo expresa con clearYear (un year:null JSON es indistinguible de omitirlo)
    const data: UpdateSubjectRequest = {
      name: formData.name,
      status: formData.status,
      ...(formData.year == null ? { clearYear: true } : { year: formData.year }),
    }
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
      <PageHeader
        title="Editar Asignatura"
        subtitle={`Modifica el nombre o estado de ${subject.code} - ${subject.name}`}
      />

      <Card className="max-w-2xl">
        <SubjectForm
          subject={subject}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={updateError}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  )
}

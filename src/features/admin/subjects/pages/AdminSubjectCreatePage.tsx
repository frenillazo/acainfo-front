import { useNavigate } from 'react-router-dom'
import { SubjectForm } from '../components/SubjectForm'
import { useCreateSubject } from '../hooks/useAdminSubjects'
import type { CreateSubjectRequest } from '../../types/admin.types'

export function AdminSubjectCreatePage() {
  const navigate = useNavigate()
  const { mutate: createSubject, isPending, error } = useCreateSubject()

  const handleSubmit = (data: CreateSubjectRequest) => {
    createSubject(data, {
      onSuccess: () => {
        navigate('/admin/subjects')
      },
    })
  }

  const handleCancel = () => {
    navigate('/admin/subjects')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Asignatura</h1>
        <p className="mt-1 text-sm text-gray-500">
          Introduce el código, nombre y grado de la nueva asignatura
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <SubjectForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

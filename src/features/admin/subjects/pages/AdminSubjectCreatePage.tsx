import { useNavigate } from 'react-router-dom'
import { Card, PageHeader } from '@/shared/components/ui'
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
      <PageHeader
        title="Crear Asignatura"
        subtitle="Introduce el código, nombre y grado de la nueva asignatura"
      />

      <Card className="max-w-2xl">
        <SubjectForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  )
}

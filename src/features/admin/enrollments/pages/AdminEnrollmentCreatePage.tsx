import { useNavigate } from 'react-router-dom'
import { Card, PageHeader } from '@/shared/components/ui'
import { EnrollmentForm } from '../components/EnrollmentForm'
import { useCreateEnrollment } from '../hooks/useAdminEnrollments'
import type { EnrollRequest } from '@/features/enrollments/types/enrollment.types'

export function AdminEnrollmentCreatePage() {
  const navigate = useNavigate()
  const { mutate: createEnrollment, isPending, error } = useCreateEnrollment()

  const handleSubmit = (data: EnrollRequest) => {
    createEnrollment(data, {
      onSuccess: () => {
        navigate('/admin/enrollments')
      },
    })
  }

  const handleCancel = () => {
    navigate('/admin/enrollments')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nueva Inscripción"
        subtitle="Selecciona un estudiante y un grupo para crear una nueva inscripción"
      />

      <Card className="max-w-2xl">
        <EnrollmentForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  )
}

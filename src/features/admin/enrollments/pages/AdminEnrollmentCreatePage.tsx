import { useNavigate } from 'react-router-dom'
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nueva Inscripción</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona un estudiante y un grupo para crear una nueva inscripción
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <EnrollmentForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

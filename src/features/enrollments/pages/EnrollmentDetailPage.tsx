import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEnrollment, useWithdraw } from '../hooks/useEnrollments'
import { EnrollmentDetailCard } from '../components/EnrollmentDetailCard'

export function EnrollmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const enrollmentId = Number(id)

  const { data: enrollment, isLoading, error } = useEnrollment(enrollmentId)
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw()

  const handleWithdraw = () => {
    if (window.confirm('¿Estás seguro de que quieres retirarte de este grupo?')) {
      withdraw(enrollmentId, {
        onSuccess: () => {
          navigate('/enrollments')
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

  if (error || !enrollment) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          Error al cargar la inscripción. Por favor, intenta de nuevo.
        </div>
        <Link to="/enrollments" className="text-blue-600 hover:text-blue-700">
          &larr; Volver a inscripciones
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/enrollments"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Volver a inscripciones
        </Link>
      </div>

      <EnrollmentDetailCard
        enrollment={enrollment}
        onWithdraw={handleWithdraw}
        isWithdrawing={isWithdrawing}
      />
    </div>
  )
}

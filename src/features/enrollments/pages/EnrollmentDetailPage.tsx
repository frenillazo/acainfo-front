import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEnrollment, useWithdraw } from '../hooks/useEnrollments'
import { EnrollmentDetailCard } from '../components/EnrollmentDetailCard'
import { EnrollmentMaterialsSection } from '../components/EnrollmentMaterialsSection'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'

export function EnrollmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const enrollmentId = Number(id)

  const { data: enrollment, isLoading, error } = useEnrollment(enrollmentId)
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdraw()
  const { dialogProps, confirm } = useConfirmDialog()

  const handleWithdraw = async () => {
    const confirmed = await confirm({
      title: 'Retirarse del grupo',
      message: '¿Estás seguro de que quieres retirarte de este grupo? Esta acción no se puede deshacer.',
      confirmLabel: 'Sí, retirarme',
      cancelLabel: 'Cancelar',
      variant: 'danger',
    })

    if (confirmed) {
      withdraw(enrollmentId, {
        onSuccess: () => {
          navigate('/enrollments')
        },
      })
    }
  }

  if (isLoading) {
    return <LoadingState />
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

      {/* Materials Section */}
      <EnrollmentMaterialsSection
        subjectId={enrollment.subjectId}
        subjectName={enrollment.subjectName}
      />

      <ConfirmDialog {...dialogProps} isLoading={isWithdrawing} />
    </div>
  )
}

import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEnrollment, useWithdraw } from '../hooks/useEnrollments'
import { EnrollmentDetailCard } from '../components/EnrollmentDetailCard'
import { EnrollmentMaterialsSection } from '../components/EnrollmentMaterialsSection'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
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
          navigate('/dashboard/enrollments')
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
        <ErrorState error={error} title="Error al cargar la inscripción" />
        <Link to="/dashboard/enrollments" className="text-blue-600 hover:text-blue-700">
          &larr; Volver a inscripciones
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Inscripciones', href: '/dashboard/enrollments' },
          { label: enrollment.subjectName },
        ]}
      />

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

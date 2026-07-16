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

  // El texto se ajusta al estado: cancelar una solicitud que aún no ha respondido
  // nadie no es lo mismo que darse de baja de un curso al que ya asistes.
  const confirmCopy = (): { title: string; message: string; confirmLabel: string } => {
    if (enrollment?.isPendingApproval) {
      return {
        title: 'Cancelar solicitud',
        message:
          '¿Cancelar tu solicitud de plaza? Puedes volver a solicitarla mientras el curso siga abierto.',
        confirmLabel: 'Sí, cancelar',
      }
    }
    if (enrollment?.isOnWaitingList) {
      return {
        title: 'Salir de la lista de espera',
        message:
          '¿Salir de la lista de espera? Perderás tu posición: si vuelves, entrarás por el final.',
        confirmLabel: 'Sí, salir',
      }
    }
    return {
      title: 'Darse de baja',
      message:
        '¿Darte de baja de este curso? Perderás la plaza y el acceso a sus materiales; si quieres volver, tendrás que solicitar plaza de nuevo.',
      confirmLabel: 'Sí, darme de baja',
    }
  }

  const handleWithdraw = async () => {
    const confirmed = await confirm({
      ...confirmCopy(),
      cancelLabel: 'Volver',
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

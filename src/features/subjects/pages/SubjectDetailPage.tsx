import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSubject, useCoursesBySubject } from '../hooks/useSubjects'
import { useEnroll, useActiveEnrollmentSubjectIds, usePendingEnrollmentsByStudent } from '@/features/enrollments/hooks/useEnrollments'
import { useAuthStore } from '@/features/auth/store/authStore'
import { CourseCard } from '../components/CourseCard'
import type { Course } from '../types/subject.types'
import { cn } from '@/shared/utils/cn'
import { useMaterialsBySubject } from '@/features/materials/hooks/useMaterials'
import { useMaterialFoldersBySubject } from '@/features/materials/hooks/useMaterialFolders'
import { useDownloadMaterial } from '@/features/materials/hooks/useMaterialMutations'
import { useMaterialViewer } from '@/features/materials/hooks/useMaterialViewer'
import { MaterialsGroupedByFolder } from '@/features/materials/components/MaterialsGroupedByFolder'
import { NoMaterialsYet } from '@/features/materials/components/NoMaterialsYet'
import { MaterialsLocked } from '@/features/materials/components/MaterialsLocked'
import { MaterialViewerModal } from '@/features/materials/components/MaterialViewer'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Alert } from '@/shared/components/ui/Alert'
import { Card } from '@/shared/components/ui'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { getApiErrorMessage } from '@/shared/utils/apiError'
import { toast } from '@/shared/hooks/useToast'
import { useCheckInterest, useMarkInterest, useRemoveInterest } from '../hooks/useSubjectInterest'
import { HandMetal } from 'lucide-react'

const degreeLabels: Record<string, string> = {
  INGENIERIA_INFORMATICA: 'Ingeniería Informática',
  INGENIERIA_INDUSTRIAL: 'Ingeniería Industrial',
}

export function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const subjectId = Number(id)

  const user = useAuthStore((state) => state.user)
  const userId = user?.id ?? 0
  const { data: subject, isLoading: isLoadingSubject, error: subjectError } = useSubject(subjectId)
  const { data: coursesData, isLoading: isLoadingCourses } = useCoursesBySubject(subjectId, 'OPEN')
  const enrollMutation = useEnroll()

  // "Me interesa" functionality
  const { data: isInterested, isLoading: isCheckingInterest } = useCheckInterest(subjectId)
  const markInterestMutation = useMarkInterest()
  const removeInterestMutation = useRemoveInterest()
  const isToggling = markInterestMutation.isPending || removeInterestMutation.isPending

  // Check if student has active enrollment in this subject
  const { hasActiveEnrollment, isLoading: isLoadingEnrollments } = useActiveEnrollmentSubjectIds(userId)
  const canAccessMaterials = hasActiveEnrollment(subjectId)

  // Solicitudes pendientes POR CURSO: marcar todos los cursos de la asignatura
  // como "esperando respuesta" ocultaba en cuál habías solicitado plaza.
  const { getPendingEnrollment } = usePendingEnrollmentsByStudent(userId)

  // Materials (TanStack Query: se cargan y refrescan solos)
  const { data: materials = [], isLoading: isLoadingMaterials } = useMaterialsBySubject(subjectId)
  const { data: folders = [] } = useMaterialFoldersBySubject(subjectId)
  const downloadMutation = useDownloadMaterial()

  const {
    isOpen: viewerOpen,
    material: viewerMaterial,
    content: viewerContent,
    viewerType,
    isLoading: viewerLoading,
    error: viewerError,
    openViewer,
    closeViewer,
  } = useMaterialViewer()

  const courses = coursesData?.content ?? []

  const handleEnroll = async (course: Course) => {
    if (!user?.id) return

    const isFull = course.availableSeats !== null && course.availableSeats <= 0
    try {
      await enrollMutation.mutateAsync({
        studentId: user.id,
        courseId: course.id,
      })
      toast.success(
        isFull
          ? 'Te has apuntado a la lista de espera. La academia te responderá pronto.'
          : 'Solicitud enviada. La academia la revisará y verás aquí la respuesta.'
      )
      navigate('/dashboard/enrollments')
    } catch {
      // El banner de la sección muestra el motivo real.
    }
  }

  const handleToggleInterest = () => {
    if (!userId || isToggling) return

    if (isInterested) {
      removeInterestMutation.mutate(subjectId)
    } else {
      markInterestMutation.mutate(subjectId)
    }
  }

  if (isLoadingSubject) {
    return <LoadingState />
  }

  if (subjectError || !subject) {
    return (
      <div className="space-y-4">
        <ErrorState error={subjectError} title="Error al cargar la asignatura" />
        <Link to="/dashboard/subjects" className="text-blue-600 hover:underline">
          Volver a asignaturas
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        homeHref="/dashboard"
        items={[
          { label: 'Asignaturas', href: '/dashboard/subjects' },
          { label: subject.name },
        ]}
      />

      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleInterest}
              disabled={isToggling || isCheckingInterest}
              className={cn(
                'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isInterested
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600',
                (isToggling || isCheckingInterest) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <HandMetal
                className={cn('h-4 w-4', isInterested && 'fill-current')}
              />
              Me renta
            </button>
            <span
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium',
                subject.active
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {subject.active ? 'Disponible' : 'Inactiva'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"
              />
            </svg>
            <span>{degreeLabels[subject.degree] || subject.degree}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>
            <span>{subject.currentGroupCount} curso{subject.currentGroupCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </Card>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Cursos Disponibles</h2>
          {isLoadingCourses && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          )}
        </div>

        {enrollMutation.isError && (
          <Alert
            variant="error"
            className="mb-4"
            message={getApiErrorMessage(
              enrollMutation.error,
              'No se ha podido enviar la solicitud. Inténtalo de nuevo.'
            )}
          />
        )}

        {courses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={handleEnroll}
                isEnrolling={enrollMutation.isPending}
                pendingEnrollmentId={getPendingEnrollment(course.id)?.id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">
              No hay cursos disponibles para esta asignatura en este momento.
            </p>
          </div>
        )}
      </section>

      {/* Materials Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Materiales de la Asignatura</h2>
          {(isLoadingMaterials || isLoadingEnrollments) && (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
          )}
        </div>

        {!canAccessMaterials ? (
          <MaterialsLocked message="Solicita plaza en uno de los cursos de arriba: cuando la academia te apruebe, el material aparecerá aquí." />
        ) : materials.length > 0 ? (
          <MaterialsGroupedByFolder
            materials={materials}
            folders={folders}
            onView={openViewer}
            onDownload={(id, filename) => downloadMutation.mutate({ id, filename })}
            isDownloading={downloadMutation.isPending}
          />
        ) : (
          <NoMaterialsYet />
        )}
      </section>

      <MaterialViewerModal
        isOpen={viewerOpen}
        material={viewerMaterial}
        content={viewerContent}
        viewerType={viewerType}
        isLoading={viewerLoading}
        error={viewerError}
        onClose={closeViewer}
        onDownload={() => {
          if (viewerMaterial) {
            downloadMutation.mutate({
              id: viewerMaterial.id,
              filename: viewerMaterial.originalFilename,
            })
          }
        }}
      />
    </div>
  )
}

import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  useAdminEnrollment,
  useChangeEnrollmentCourse,
} from '../hooks/useAdminEnrollments'
import { adminApi } from '../../services/adminApi'
import { LoadingState } from '@/shared/components/common/LoadingState'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Card, PageHeader } from '@/shared/components/ui'
import { cn } from '@/shared/utils/cn'
import { getApiErrorMessage } from '@/shared/utils/apiError'

export function AdminEnrollmentChangeCoursePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const enrollmentId = id ? parseInt(id, 10) : 0

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [courseSearch, setCourseSearch] = useState('')

  const { data: enrollment, isLoading: isLoadingEnrollment } = useAdminEnrollment(enrollmentId)
  const { mutate: changeCourse, isPending, error } = useChangeEnrollmentCourse()

  // Fetch courses
  const { data: coursesData, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['admin', 'courses', { size: 100 }],
    queryFn: () => adminApi.getCourses({ size: 100 }),
  })

  const courses = coursesData?.content ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourseId) return

    changeCourse(
      { id: enrollmentId, data: { newCourseId: selectedCourseId } },
      {
        onSuccess: () => {
          navigate(`/admin/enrollments/${enrollmentId}`)
        },
      }
    )
  }

  const handleCancel = () => {
    navigate(`/admin/enrollments/${enrollmentId}`)
  }

  if (isLoadingEnrollment) {
    return <LoadingState />
  }

  if (!enrollment) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/enrollments"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          ← Volver a inscripciones
        </Link>
        <ErrorState error={error} title="Error al cargar la inscripción" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to={`/admin/enrollments/${enrollmentId}`}
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← Volver al detalle
      </Link>

      <PageHeader
        title="Cambiar Curso"
        subtitle={`Cambiar curso para la inscripción de ${enrollment.studentName} en ${enrollment.subjectName}`}
      />

      {/* Current Course Info */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700">Curso actual</h3>
        <p className="mt-1 text-gray-900">
          {enrollment.subjectName} - {enrollment.courseName}
        </p>
        <p className="text-sm text-gray-500">Profesor: {enrollment.teacherName ?? 'Sin asignar'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <label
            htmlFor="courseSearch"
            className="block text-sm font-medium text-gray-700"
          >
            Nuevo Curso
          </label>
          <input
            type="text"
            id="courseSearch"
            placeholder="Buscar curso..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
          />
          <div className="mt-2 max-h-64 overflow-y-auto rounded-md border border-gray-200">
            {isLoadingCourses ? (
              <div className="p-3 text-center text-sm text-gray-500">Cargando...</div>
            ) : courses.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500">
                No se encontraron cursos
              </div>
            ) : (
              courses
                .filter((course) => course.id !== enrollment.courseId)
                // Cambiar de curso es mover al alumno DENTRO de su asignatura.
                // Se listaban los cursos de TODAS (ni la UI ni el back lo
                // impiden): un despiste lo pasaba a otra asignatura.
                .filter((course) => course.subjectId === enrollment.subjectId)
                .filter((course) =>
                  courseSearch
                    ? course.subjectName?.toLowerCase().includes(courseSearch.toLowerCase()) ||
                      course.name?.toLowerCase().includes(courseSearch.toLowerCase())
                    : true
                )
                .map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelectedCourseId(course.id)}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50',
                      selectedCourseId === course.id && 'bg-blue-50 text-blue-700'
                    )}
                  >
                    <div>
                      <div className="font-medium">
                        {course.subjectName} - {course.name}
                      </div>
                      <div className="text-gray-500">
                        Profesor: {course.teacherName ?? 'Sin asignar'} | Capacidad:{' '}
                        {course.currentEnrollmentCount}/
                        {course.capacity ?? '∞'}
                      </div>
                    </div>
                    {selectedCourseId === course.id && (
                      <span className="text-blue-600">✓</span>
                    )}
                  </button>
                ))
            )}
          </div>
        </Card>

        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-700">
              {getApiErrorMessage(error, 'Error al cambiar de curso')}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || !selectedCourseId}
            className={cn(
              'rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {isPending ? 'Cambiando...' : 'Cambiar curso'}
          </button>
        </div>
      </form>
    </div>
  )
}

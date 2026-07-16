import { useNavigate, useParams } from 'react-router-dom'
import { CourseForm } from '../components/CourseForm'
import { useAdminCourse, useUpdateCourse } from '../hooks/useAdminCourses'
import type { UpdateCourseRequest } from '../../types/admin.types'

export function AdminCourseEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const courseId = Number(id)

  const { data: course, isLoading, error: loadError } = useAdminCourse(courseId)
  const { mutate: updateCourse, isPending, error: updateError } = useUpdateCourse()

  const handleSubmit = (data: UpdateCourseRequest) => {
    updateCourse(
      { id: courseId, data },
      {
        onSuccess: () => {
          navigate(`/admin/courses/${courseId}`)
        },
      }
    )
  }

  const handleCancel = () => {
    navigate(`/admin/courses/${courseId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando curso...</div>
      </div>
    )
  }

  if (loadError || !course) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">Error al cargar el curso</p>
        <button
          onClick={() => navigate('/admin/courses')}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800"
        >
          Volver al listado
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editar Curso</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modifica el estado, capacidad o fechas del curso {course.subjectName}
        </p>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <CourseForm
          course={course}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={updateError}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

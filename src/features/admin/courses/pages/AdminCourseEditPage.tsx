import { useNavigate, useParams } from 'react-router-dom'
import { Card, PageHeader } from '@/shared/components/ui'
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
      <PageHeader
        title="Editar Curso"
        subtitle={`Modifica el estado, capacidad o fechas del curso ${course.subjectName}`}
      />

      <Card className="max-w-2xl">
        <CourseForm
          course={course}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={updateError}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  )
}

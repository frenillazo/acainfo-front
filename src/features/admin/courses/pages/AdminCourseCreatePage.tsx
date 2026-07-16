import { useNavigate } from 'react-router-dom'
import { CourseForm } from '../components/CourseForm'
import { useCreateCourse } from '../hooks/useAdminCourses'
import type { CreateCourseRequest } from '../../types/admin.types'

export function AdminCourseCreatePage() {
  const navigate = useNavigate()
  const { mutate: createCourse, isPending, error } = useCreateCourse()

  const handleSubmit = (data: CreateCourseRequest) => {
    createCourse(data, {
      onSuccess: () => {
        navigate('/admin/courses')
      },
    })
  }

  const handleCancel = () => {
    navigate('/admin/courses')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Curso</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona una asignatura y el rango de fechas para crear un nuevo curso
        </p>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <CourseForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

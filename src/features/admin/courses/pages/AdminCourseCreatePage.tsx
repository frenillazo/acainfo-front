import { useNavigate } from 'react-router-dom'
import { Card, PageHeader } from '@/shared/components/ui'
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
      <PageHeader
        title="Crear Curso"
        subtitle="Selecciona una asignatura y el rango de fechas para crear un nuevo curso"
      />

      <Card className="max-w-2xl">
        <CourseForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  )
}

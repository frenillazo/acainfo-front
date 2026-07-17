import { useNavigate } from 'react-router-dom'
import { Card, PageHeader } from '@/shared/components/ui'
import { TeacherForm } from '../components/TeacherForm'
import { useCreateTeacher } from '../hooks/useAdminTeachers'
import type { CreateTeacherRequest } from '../../types/admin.types'

export function AdminTeacherCreatePage() {
  const navigate = useNavigate()
  const { mutate: createTeacher, isPending, error } = useCreateTeacher()

  const handleSubmit = (data: CreateTeacherRequest) => {
    createTeacher(data, {
      onSuccess: () => {
        navigate('/admin/teachers')
      },
    })
  }

  const handleCancel = () => {
    navigate('/admin/teachers')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crear Profesor"
        subtitle="Completa los datos para crear un nuevo profesor"
      />

      <Card className="max-w-2xl">
        <TeacherForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={handleCancel}
        />
      </Card>
    </div>
  )
}

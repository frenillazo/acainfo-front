import { useNavigate } from 'react-router-dom'
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Profesor</h1>
        <p className="mt-1 text-sm text-gray-500">
          Completa los datos para crear un nuevo profesor
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <TeacherForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

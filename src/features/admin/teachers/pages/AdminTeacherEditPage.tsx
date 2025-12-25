import { useNavigate, useParams } from 'react-router-dom'
import { TeacherForm } from '../components/TeacherForm'
import { useAdminTeacher, useUpdateTeacher } from '../hooks/useAdminTeachers'
import type { UpdateTeacherRequest } from '../../types/admin.types'

export function AdminTeacherEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const teacherId = Number(id)

  const { data: teacher, isLoading, error: loadError } = useAdminTeacher(teacherId)
  const { mutate: updateTeacher, isPending, error: updateError } = useUpdateTeacher()

  const handleSubmit = (data: UpdateTeacherRequest) => {
    updateTeacher(
      { id: teacherId, data },
      {
        onSuccess: () => {
          navigate(`/admin/teachers/${teacherId}`)
        },
      }
    )
  }

  const handleCancel = () => {
    navigate(`/admin/teachers/${teacherId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando profesor...</div>
      </div>
    )
  }

  if (loadError || !teacher) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">Error al cargar el profesor</p>
        <button
          onClick={() => navigate('/admin/teachers')}
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
        <h1 className="text-2xl font-bold text-gray-900">Editar Profesor</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modifica los datos del profesor {teacher.fullName}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <TeacherForm
          teacher={teacher}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={updateError}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

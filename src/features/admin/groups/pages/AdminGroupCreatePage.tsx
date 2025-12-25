import { useNavigate } from 'react-router-dom'
import { GroupForm } from '../components/GroupForm'
import { useCreateGroup } from '../hooks/useAdminGroups'
import type { CreateGroupRequest } from '../../types/admin.types'

export function AdminGroupCreatePage() {
  const navigate = useNavigate()
  const { mutate: createGroup, isPending, error } = useCreateGroup()

  const handleSubmit = (data: CreateGroupRequest) => {
    createGroup(data, {
      onSuccess: () => {
        navigate('/admin/groups')
      },
    })
  }

  const handleCancel = () => {
    navigate('/admin/groups')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Grupo</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona una asignatura, profesor y tipo para crear un nuevo grupo
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <GroupForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

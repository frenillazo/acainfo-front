import { useNavigate, useParams } from 'react-router-dom'
import { GroupForm } from '../components/GroupForm'
import { useAdminGroup, useUpdateGroup } from '../hooks/useAdminGroups'
import type { UpdateGroupRequest } from '../../types/admin.types'

export function AdminGroupEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const groupId = Number(id)

  const { data: group, isLoading, error: loadError } = useAdminGroup(groupId)
  const { mutate: updateGroup, isPending, error: updateError } = useUpdateGroup()

  const handleSubmit = (data: UpdateGroupRequest) => {
    updateGroup(
      { id: groupId, data },
      {
        onSuccess: () => {
          navigate(`/admin/groups/${groupId}`)
        },
      }
    )
  }

  const handleCancel = () => {
    navigate(`/admin/groups/${groupId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando grupo...</div>
      </div>
    )
  }

  if (loadError || !group) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">Error al cargar el grupo</p>
        <button
          onClick={() => navigate('/admin/groups')}
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
        <h1 className="text-2xl font-bold text-gray-900">Editar Grupo</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modifica el estado o capacidad del grupo {group.subjectName}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <GroupForm
          group={group}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={updateError}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

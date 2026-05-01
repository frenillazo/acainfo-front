import { useNavigate, useParams } from 'react-router-dom'
import { IntensiveForm } from '../components/IntensiveForm'
import { useAdminIntensive, useUpdateIntensive } from '../hooks/useAdminIntensives'
import type { UpdateIntensiveRequest } from '../types/intensive.types'

export function AdminIntensiveEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const intensiveId = Number(id)

  const { data: intensive, isLoading, error: loadError } = useAdminIntensive(intensiveId)
  const { mutate: updateIntensive, isPending, error: updateError } = useUpdateIntensive()

  const handleSubmit = (data: UpdateIntensiveRequest) => {
    updateIntensive(
      { id: intensiveId, data },
      { onSuccess: () => navigate(`/admin/intensives/${intensiveId}`) }
    )
  }

  if (isLoading) {
    return <div className="flex items-center justify-center py-12 text-gray-500">Cargando intensivo...</div>
  }

  if (loadError || !intensive) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700">Error al cargar el intensivo</p>
        <button
          onClick={() => navigate('/admin/intensives')}
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
        <h1 className="text-2xl font-bold text-gray-900">Editar Intensivo</h1>
        <p className="mt-1 text-sm text-gray-500">
          Modifica el estado, capacidad o fechas del intensivo {intensive.subjectName}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <IntensiveForm
          intensive={intensive}
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={updateError}
          onCancel={() => navigate(`/admin/intensives/${intensiveId}`)}
        />
      </div>
    </div>
  )
}

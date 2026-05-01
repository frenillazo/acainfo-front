import { useNavigate } from 'react-router-dom'
import { IntensiveForm } from '../components/IntensiveForm'
import { useCreateIntensive } from '../hooks/useAdminIntensives'
import type { CreateIntensiveRequest } from '../types/intensive.types'

export function AdminIntensiveCreatePage() {
  const navigate = useNavigate()
  const { mutate: createIntensive, isPending, error } = useCreateIntensive()

  const handleSubmit = (data: CreateIntensiveRequest) => {
    createIntensive(data, {
      onSuccess: (created) => {
        // Tras crear, ve directamente al detalle para añadir las sesiones.
        navigate(`/admin/intensives/${created.id}`)
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Intensivo</h1>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona la asignatura, profesor y rango de fechas. Después podrás añadir las sesiones puntuales.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <IntensiveForm
          onSubmit={handleSubmit}
          isSubmitting={isPending}
          error={error}
          onCancel={() => navigate('/admin/intensives')}
        />
      </div>
    </div>
  )
}

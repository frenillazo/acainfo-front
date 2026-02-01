import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useMarkInterest } from '../hooks/useGroupRequests'
import { useSubjects, useSubject } from '@/features/subjects/hooks/useSubjects'
import { useAuthStore } from '@/features/auth/store/authStore'
import { ErrorState } from '@/shared/components/common/ErrorState'
import { Heart } from 'lucide-react'

export function GroupRequestCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedSubjectId = searchParams.get('subjectId')

  const { user } = useAuthStore()
  const markInterestMutation = useMarkInterest()

  // Cargar asignaturas para el selector
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects({ status: 'ACTIVE' })
  const subjects = subjectsData?.content ?? []

  // Cargar datos de la asignatura preseleccionada
  const { data: preselectedSubject } = useSubject(preselectedSubjectId ? Number(preselectedSubjectId) : 0)

  const [formData, setFormData] = useState({
    subjectId: preselectedSubjectId || '',
  })

  // Actualizar subjectId cuando se carga de la URL
  useEffect(() => {
    if (preselectedSubjectId) {
      setFormData(prev => ({ ...prev, subjectId: preselectedSubjectId }))
    }
  }, [preselectedSubjectId])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.subjectId) {
      newErrors.subjectId = 'La asignatura es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !user) return

    markInterestMutation.mutate(
      {
        subjectId: parseInt(formData.subjectId, 10),
        requesterId: user.id,
      },
      {
        onSuccess: () => {
          navigate('/dashboard/group-requests')
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/dashboard/group-requests"
        className="inline-flex items-center text-sm text-pink-600 hover:text-pink-800"
      >
        ← Volver a mis intereses
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          <Heart className="inline-block h-6 w-6 mr-2 text-pink-500" />
          Marcar Interes
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Indica que asignatura te interesa para que los administradores puedan ver la demanda.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="space-y-6">
            {/* Subject */}
            <div>
              <label
                htmlFor="subjectId"
                className="block text-sm font-medium text-gray-700"
              >
                Asignatura *
              </label>
              {preselectedSubject ? (
                <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm">
                  <span className="font-medium">{preselectedSubject.code}</span> - {preselectedSubject.name}
                </div>
              ) : (
                <select
                  id="subjectId"
                  value={formData.subjectId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subjectId: e.target.value }))
                  }
                  disabled={isLoadingSubjects}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                    errors.subjectId
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-pink-500 focus:ring-pink-500'
                  }`}
                >
                  <option value="">Selecciona una asignatura</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.subjectId && (
                <p className="mt-1 text-sm text-red-600">{errors.subjectId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-lg border border-pink-200 bg-pink-50 p-4">
          <h3 className="text-sm font-medium text-pink-800">
            <Heart className="inline-block h-4 w-4 mr-1" />
            Como funciona
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-pink-700">
            <li>1. Selecciona la asignatura que te interesa</li>
            <li>2. Los administradores veran cuantos alumnos estan interesados</li>
            <li>3. Podras quitar tu interes en cualquier momento</li>
          </ul>
        </div>

        {/* Error message */}
        {markInterestMutation.isError && (
          <ErrorState error={markInterestMutation.error} title="Error al marcar interes" />
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            to="/dashboard/group-requests"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={markInterestMutation.isPending}
            className="rounded-md bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-50"
          >
            {markInterestMutation.isPending ? 'Guardando...' : 'Me interesa'}
          </button>
        </div>
      </form>
    </div>
  )
}

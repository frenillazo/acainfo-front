import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useCreateGroupRequest } from '../hooks/useGroupRequests'
import { useSubjects, useSubject } from '@/features/subjects/hooks/useSubjects'
import type { GroupType } from '@/shared/types/api.types'
import { useAuthStore } from '@/features/auth/store/authStore'

const groupTypeOptions: { value: GroupType; label: string }[] = [
  { value: 'REGULAR_Q1', label: 'Regular Q1' },
  { value: 'REGULAR_Q2', label: 'Regular Q2' },
  { value: 'INTENSIVE_Q1', label: 'Intensivo Q1' },
  { value: 'INTENSIVE_Q2', label: 'Intensivo Q2' },
]

export function GroupRequestCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preselectedSubjectId = searchParams.get('subjectId')

  const { user } = useAuthStore()
  const createMutation = useCreateGroupRequest()

  // Cargar asignaturas para el selector
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects({ status: 'ACTIVE' })
  const subjects = subjectsData?.content ?? []

  // Cargar datos de la asignatura preseleccionada
  const { data: preselectedSubject } = useSubject(preselectedSubjectId ? Number(preselectedSubjectId) : 0)

  const [formData, setFormData] = useState({
    subjectId: preselectedSubjectId || '',
    requestedGroupType: '' as GroupType | '',
    justification: '',
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

    if (!formData.requestedGroupType) {
      newErrors.requestedGroupType = 'El tipo de grupo es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate() || !user) return

    createMutation.mutate(
      {
        subjectId: parseInt(formData.subjectId, 10),
        requesterId: user.id,
        requestedGroupType: formData.requestedGroupType as GroupType,
        justification: formData.justification || undefined,
      },
      {
        onSuccess: () => {
          navigate(preselectedSubjectId ? `/subjects/${preselectedSubjectId}` : '/subjects')
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to={preselectedSubjectId ? `/subjects/${preselectedSubjectId}` : '/subjects'}
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← {preselectedSubjectId ? 'Volver a la asignatura' : 'Volver a asignaturas'}
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Nueva Solicitud de Grupo
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Solicita la creacion de un nuevo grupo para una materia.
          Necesitas al menos 8 apoyos para que tu solicitud sea considerada.
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
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
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

            {/* Group Type */}
            <div>
              <label
                htmlFor="requestedGroupType"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de Grupo *
              </label>
              <select
                id="requestedGroupType"
                value={formData.requestedGroupType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    requestedGroupType: e.target.value as GroupType,
                  }))
                }
                className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                  errors.requestedGroupType
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              >
                <option value="">Selecciona un tipo</option>
                {groupTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.requestedGroupType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.requestedGroupType}
                </p>
              )}
            </div>

            {/* Justification */}
            <div>
              <label
                htmlFor="justification"
                className="block text-sm font-medium text-gray-700"
              >
                Justificacion (opcional)
              </label>
              <textarea
                id="justification"
                rows={4}
                value={formData.justification}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    justification: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Explica por que necesitas este nuevo grupo..."
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.justification.length}/500 caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-medium text-blue-800">
            Como funciona el proceso
          </h3>
          <ul className="mt-2 space-y-1 text-sm text-blue-700">
            <li>1. Tu solicitud sera visible para otros estudiantes</li>
            <li>2. Necesitas que al menos 8 estudiantes apoyen tu solicitud</li>
            <li>3. Un administrador revisara las solicitudes con suficientes apoyos</li>
            <li>4. Si se aprueba, se creara el nuevo grupo</li>
          </ul>
        </div>

        {/* Error message */}
        {createMutation.isError && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            Error al crear la solicitud. Por favor, intenta de nuevo.
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            to={preselectedSubjectId ? `/subjects/${preselectedSubjectId}` : '/subjects'}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creando...' : 'Crear Solicitud'}
          </button>
        </div>
      </form>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAdminCourses } from '../../courses/hooks/useAdminCourses'
import { useGenerateSessions, usePreviewGenerateSessions } from '../hooks/useAdminSessions'
import { SessionTable } from '../components/SessionTable'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { Card, PageHeader } from '@/shared/components/ui'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { toast } from '@/shared/hooks/useToast'
import type { GenerateSessionsRequest, Session } from '../../types/admin.types'
import { getApiErrorMessage } from '@/shared/utils/apiError'

export function AdminSessionGeneratePage() {
  const navigate = useNavigate()
  const [courseId, setCourseId] = useState<number | ''>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [previewSessions, setPreviewSessions] = useState<Session[]>([])

  const { data: coursesData, isLoading: isLoadingCourses } = useAdminCourses({
    size: 100,
    status: 'OPEN',
  })
  const courses = coursesData?.content ?? []

  const previewMutation = usePreviewGenerateSessions()
  const generateMutation = useGenerateSessions()
  const { dialogProps, confirm } = useConfirmDialog()

  const isFormValid = courseId && startDate && endDate && new Date(startDate) <= new Date(endDate)

  const handlePreview = () => {
    if (!isFormValid || typeof courseId !== 'number') return

    const request: GenerateSessionsRequest = {
      courseId,
      startDate,
      endDate,
    }

    previewMutation.mutate(request, {
      onSuccess: (sessions) => {
        setPreviewSessions(sessions)
      },
    })
  }

  const handleGenerate = async () => {
    if (!isFormValid || typeof courseId !== 'number') return

    const confirmed = await confirm({
      title: 'Generar sesiones',
      message: `¿Generar ${previewSessions.length} sesiones?`,
      confirmLabel: 'Sí, generar',
      variant: 'info',
    })
    if (!confirmed) return

    const request: GenerateSessionsRequest = {
      courseId,
      startDate,
      endDate,
    }

    generateMutation.mutate(request, {
      onSuccess: (sessions) => {
        toast.success(`Se han generado ${sessions.length} sesiones correctamente.`)
        navigate('/admin/sessions')
      },
    })
  }

  const handleClearPreview = () => {
    setPreviewSessions([])
  }

  const selectedCourse = courses.find(c => c.id === courseId)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        to="/admin/sessions"
        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
      >
        ← Volver a sesiones
      </Link>

      <PageHeader
        title="Generar Sesiones"
        subtitle="Genera sesiones automaticamente basandose en los horarios del curso."
      />

      {/* Form */}
      <Card>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">
              Curso *
            </label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value ? Number(e.target.value) : '')
                setPreviewSessions([])
              }}
              disabled={isLoadingCourses}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Selecciona un curso</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.subjectCode} - {c.name}
                </option>
              ))}
            </select>
            {selectedCourse && (
              <p className="mt-1 text-xs text-gray-500">
                {selectedCourse.subjectName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Fecha inicio *
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setPreviewSessions([])
              }}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              Fecha fin *
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setPreviewSessions([])
              }}
              min={startDate}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handlePreview}
            disabled={!isFormValid || previewMutation.isPending}
            className="rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            {previewMutation.isPending ? 'Cargando...' : 'Vista previa'}
          </button>

          {previewSessions.length > 0 && (
            <>
              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {generateMutation.isPending ? 'Generando...' : `Generar ${previewSessions.length} sesiones`}
              </button>
              <button
                onClick={handleClearPreview}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Limpiar
              </button>
            </>
          )}
        </div>

        {previewMutation.error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            Error al generar vista previa: {getApiErrorMessage(previewMutation.error, 'inténtalo de nuevo')}
          </div>
        )}

        {generateMutation.error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            Error al generar sesiones: {getApiErrorMessage(generateMutation.error, 'inténtalo de nuevo')}
          </div>
        )}
      </Card>

      {/* How it works */}
      <div className="rounded-lg border border-gray-200 bg-blue-50 p-4 shadow-sm">
        <h3 className="text-sm font-medium text-blue-800">Cómo funciona</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700">
          <li>Selecciona un curso que tenga horarios configurados</li>
          <li>Indica el rango de fechas para el cual deseas generar sesiones</li>
          <li>El sistema creará una sesión por cada dia que coincida con los horarios del curso</li>
          <li>No se crearán sesiones duplicadas si ya existen para esa fecha y horario</li>
          <li>Usa "Vista previa" para ver las sesiones que se crearán antes de confirmar</li>
        </ul>
      </div>

      {/* Preview Results */}
      {previewSessions.length > 0 && (
        <Card padding="none">
          <div className="border-b border-gray-200 px-4 py-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Vista previa ({previewSessions.length} sesiones)
            </h2>
            <p className="text-sm text-gray-500">
              Estas son las sesiones que se crearán. Revisa y confirma para generarlas.
            </p>
          </div>
          <SessionTable sessions={previewSessions} />
        </Card>
      )}

      {previewMutation.isSuccess && previewSessions.length === 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
          No se encontraron sesiones para generar en el rango de fechas seleccionado.
          Verifica que el curso tenga horarios configurados.
        </div>
      )}

      <ConfirmDialog {...dialogProps} isLoading={generateMutation.isPending} />
    </div>
  )
}

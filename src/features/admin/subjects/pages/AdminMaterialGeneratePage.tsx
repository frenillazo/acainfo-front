import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Sparkles, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { useAdminSubject } from '../hooks/useAdminSubjects'
import { FolderSelector } from '@/features/materials/components/FolderSelector'
import { useAiJob, useGenerateAiMaterial } from '@/features/materials/hooks/useMaterialAi'
import { MultiFileUpload } from '@/shared/components/form'
import { ConfirmDialog } from '@/shared/components/common/ConfirmDialog'
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog'
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs'
import { getApiErrorMessage } from '@/shared/utils/apiError'

/**
 * Genera ejercicios de repaso con IA a partir de capturas de la clase.
 * La petición devuelve el job al instante y la página hace polling (useAiJob);
 * "Relanzar" tras un fallo re-envía la petición original creando un job NUEVO
 * (la tabla de jobs no persiste ni capturas ni parámetros).
 */
export function AdminMaterialGeneratePage() {
  const { id } = useParams<{ id: string }>()
  const subjectId = id ? parseInt(id, 10) : 0

  const { data: subject } = useAdminSubject(subjectId)

  const [images, setImages] = useState<File[]>([])
  const [folderId, setFolderId] = useState<number | null>(null)
  const [exerciseCount, setExerciseCount] = useState(2)
  const [jobId, setJobId] = useState<number | null>(null)

  const generateMutation = useGenerateAiMaterial()
  const { data: job, timedOut } = useAiJob(jobId)
  const { dialogProps, confirm } = useConfirmDialog()

  const jobInProgress =
    jobId !== null && !timedOut && job?.status !== 'COMPLETED' && job?.status !== 'FAILED'
  const formDisabled = generateMutation.isPending || jobInProgress

  const launchJob = () => {
    generateMutation.mutate(
      { metadata: { subjectId, folderId, exerciseCount }, images },
      { onSuccess: (createdJob) => setJobId(createdJob.id) }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) return

    const confirmed = await confirm({
      title: 'Generar ejercicios con IA',
      message: `Se generarán ${exerciseCount} ejercicio(s) de repaso a partir de ${images.length} captura(s) y se publicarán como material visible para los estudiantes. ¿Continuar?`,
      confirmLabel: 'Sí, generar',
      variant: 'info',
    })
    if (!confirmed) return
    launchJob()
  }

  const mutationError = generateMutation.error
    ? getApiErrorMessage(generateMutation.error, 'No se pudo lanzar la generación')
    : null

  return (
    <div className="space-y-6">
      <Breadcrumbs
        homeHref="/admin"
        items={[
          { label: 'Asignaturas', href: '/admin/subjects' },
          { label: subject?.name ?? `Asignatura ${subjectId}`, href: `/admin/subjects/${subjectId}` },
          { label: 'Generar con IA' },
        ]}
      />

      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <Sparkles className="h-6 w-6 text-violet-600" />
          Generar ejercicios con IA
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Sube capturas de los enunciados trabajados en clase y la IA creará ejercicios
          de repaso similares, con solución, publicados como PDF en la asignatura.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <MultiFileUpload
          label="Capturas de la clase"
          value={images}
          onChange={setImages}
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={formDisabled}
          helperText="Fotos o capturas con los enunciados (JPEG, PNG, WebP o GIF)"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FolderSelector
            subjectId={subjectId}
            value={folderId}
            onChange={setFolderId}
            disabled={formDisabled}
          />

          <div>
            <label htmlFor="exerciseCount" className="block text-sm font-medium text-gray-700">
              Número de ejercicios
            </label>
            <input
              type="number"
              id="exerciseCount"
              min={1}
              max={10}
              value={exerciseCount}
              onChange={(e) => setExerciseCount(Number(e.target.value))}
              disabled={formDisabled}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        {mutationError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{mutationError}</div>
        )}

        <button
          type="submit"
          disabled={images.length === 0 || formDisabled}
          className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {generateMutation.isPending ? 'Lanzando...' : 'Generar ejercicios'}
        </button>
      </form>

      {/* Job progress */}
      {jobId !== null && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {jobInProgress && (
            <div className="flex items-center gap-3 text-gray-700">
              <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
              <div>
                <p className="font-medium">
                  {job?.status === 'RUNNING' ? 'Generando el documento...' : 'En cola...'}
                </p>
                <p className="text-sm text-gray-500">
                  La IA redacta los ejercicios y se compila el PDF; suele tardar menos de un
                  minuto. Puedes dejar esta página abierta.
                </p>
              </div>
            </div>
          )}

          {job?.status === 'COMPLETED' && (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Material publicado</p>
                <p className="text-sm text-gray-500">
                  Los ejercicios están disponibles en la asignatura, visibles para los estudiantes.
                </p>
                <Link
                  to={`/admin/subjects/${subjectId}`}
                  className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                >
                  Ver los materiales de la asignatura →
                </Link>
              </div>
            </div>
          )}

          {job?.status === 'FAILED' && (
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">La generación falló</p>
                <p className="text-sm text-red-700">{job.errorMessage}</p>
                <button
                  onClick={launchJob}
                  disabled={generateMutation.isPending || images.length === 0}
                  className="mt-2 rounded-md border border-violet-600 px-3 py-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50 disabled:opacity-50"
                >
                  Relanzar con las mismas capturas
                </button>
              </div>
            </div>
          )}

          {timedOut && jobInProgress === false && job?.status !== 'COMPLETED' && job?.status !== 'FAILED' && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 flex-shrink-0 text-amber-500" />
              <div>
                <p className="font-medium text-gray-900">Esto está tardando más de lo normal</p>
                <p className="text-sm text-gray-500">
                  Se ha dejado de consultar el estado tras 10 minutos. El trabajo puede seguir en
                  marcha: revisa los materiales de la asignatura en un rato o relanza la generación.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <ConfirmDialog {...dialogProps} isLoading={generateMutation.isPending} />
    </div>
  )
}

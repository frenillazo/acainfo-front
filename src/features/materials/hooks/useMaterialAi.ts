import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/shared/hooks/useToast'
import { materialAiApi } from '../services/materialAiApi'
import type { GenerateAiMaterialRequest, MaterialAiJobStatus } from '../types/material.types'
import { materialKeys } from './useMaterials'

export const materialAiKeys = {
  all: ['material-ai-jobs'] as const,
  job: (jobId: number) => [...materialAiKeys.all, jobId] as const,
}

const POLL_INTERVAL_MS = 3000
// Corte de seguridad: un job no debería pasar de unos minutos (Claude + tectonic
// + 2 reintentos); a los 10 min dejamos de refetchear y avisamos.
const POLL_TIMEOUT_MS = 10 * 60 * 1000

const TERMINAL_STATUSES: MaterialAiJobStatus[] = ['COMPLETED', 'FAILED']

/**
 * Polling del estado de un job de IA (primer uso de refetchInterval del
 * codebase): cada 3s mientras esté PENDING/RUNNING, se apaga al terminar.
 * Al COMPLETED invalida materialKeys.all (el material nuevo aparece solo)
 * y lanza toast; al FAILED, toast de error con el mensaje del back.
 * jobId null = polling apagado.
 */
export function useAiJob(jobId: number | null) {
  const queryClient = useQueryClient()
  // El cronómetro del corte arranca en la PRIMERA consulta de cada job (queryFn,
  // fuera del render: las reglas de pureza vetan Date.now() en render). El
  // timeout se guarda keyed por job: cambiar de job lo resetea solo.
  const startedAtRef = useRef<{ jobId: number | null; at: number }>({ jobId: null, at: 0 })
  const [timedOutJobId, setTimedOutJobId] = useState<number | null>(null)
  const notifiedJobRef = useRef<number | null>(null)

  const query = useQuery({
    queryKey: materialAiKeys.job(jobId ?? 0),
    queryFn: () => {
      if (startedAtRef.current.jobId !== jobId) {
        startedAtRef.current = { jobId, at: Date.now() }
      }
      return materialAiApi.getJob(jobId as number)
    },
    enabled: jobId !== null,
    // Sin esto el polling se PAUSA con la pestaña en segundo plano (default de
    // TanStack) y el toast/invalidación no llegan hasta que el admin vuelve;
    // el corte de 10 min acota el coste de sondear en background.
    refetchIntervalInBackground: true,
    refetchInterval: (q) => {
      const status = q.state.data?.status
      if (status && TERMINAL_STATUSES.includes(status)) return false
      if (
        startedAtRef.current.jobId === jobId &&
        Date.now() - startedAtRef.current.at > POLL_TIMEOUT_MS
      ) {
        setTimedOutJobId(jobId)
        return false
      }
      return POLL_INTERVAL_MS
    },
  })

  const status = query.data?.status
  const errorMessage = query.data?.errorMessage
  useEffect(() => {
    if (jobId === null || notifiedJobRef.current === jobId) return
    if (status === 'COMPLETED') {
      notifiedJobRef.current = jobId
      toast.success('Material generado y publicado correctamente')
      queryClient.invalidateQueries({ queryKey: materialKeys.all })
    } else if (status === 'FAILED') {
      notifiedJobRef.current = jobId
      toast.error(errorMessage ?? 'El trabajo de generación falló')
    }
  }, [jobId, status, errorMessage, queryClient])

  return { ...query, timedOut: timedOutJobId !== null && timedOutJobId === jobId }
}

/** ADMIN: lanzar un job GENERATE (capturas -> ejercicios de repaso en PDF). */
export function useGenerateAiMaterial() {
  return useMutation({
    mutationFn: ({
      metadata,
      images,
    }: {
      metadata: GenerateAiMaterialRequest
      images: File[]
    }) => materialAiApi.generate(metadata, images),
  })
}

/** ADMIN: lanzar un job TRANSCRIBE (PDF publicado -> transcripción a limpio). */
export function useTranscribeAiMaterial() {
  return useMutation({
    mutationFn: (materialId: number) => materialAiApi.transcribe(materialId),
  })
}

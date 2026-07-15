import { apiClient } from '@/shared/services/apiClient'
import type { GenerateAiMaterialRequest, MaterialAiJob } from '../types/material.types'

export const materialAiApi = {
  // POST /materials/ai/generate - Launch a GENERATE job (multipart: metadata + N captures)
  generate: async (
    metadata: GenerateAiMaterialRequest,
    images: File[]
  ): Promise<MaterialAiJob> => {
    const formData = new FormData()
    formData.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    )
    images.forEach((image) => formData.append('images', image))

    const response = await apiClient.post<MaterialAiJob>('/materials/ai/generate', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  // POST /materials/{id}/ai/transcribe - Launch a TRANSCRIBE job for a published PDF
  transcribe: async (materialId: number): Promise<MaterialAiJob> => {
    const response = await apiClient.post<MaterialAiJob>(`/materials/${materialId}/ai/transcribe`)
    return response.data
  },

  // GET /materials/ai/jobs/{jobId} - Poll a job's state
  getJob: async (jobId: number): Promise<MaterialAiJob> => {
    const response = await apiClient.get<MaterialAiJob>(`/materials/ai/jobs/${jobId}`)
    return response.data
  },
}

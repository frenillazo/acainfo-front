import { apiClient } from '@/shared/services/apiClient'
import type {
  Material,
  UploadMaterialRequest,
  UpdateMaterialRequest,
  BatchUpdateResponse,
  CanDownloadResponse,
} from '../types/material.types'

export const materialApi = {
  // POST /materials - Upload a material file
  upload: async (
    metadata: UploadMaterialRequest,
    file: File
  ): Promise<Material> => {
    const formData = new FormData()

    // Add metadata as JSON blob
    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    })
    formData.append('metadata', metadataBlob)

    // Add file
    formData.append('file', file)

    const response = await apiClient.post<Material>('/materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // GET /materials/{id} - Get material metadata
  getById: async (id: number): Promise<Material> => {
    const response = await apiClient.get<Material>(`/materials/${id}`)
    return response.data
  },

  // GET /materials/{id}/download - Download material file
  download: async (id: number, filename: string): Promise<void> => {
    const response = await apiClient.get(`/materials/${id}/download`, {
      responseType: 'blob',
    })

    // Create a blob URL and trigger download
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  // GET /materials/{id}/preview - Get content as Blob (for in-app viewer).
  // Uses a separate endpoint that ignores the admin downloadDisabled flag,
  // so a material can be visible & previewable but not directly downloadable.
  getContent: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/materials/${id}/preview`, {
      responseType: 'blob',
    })
    return new Blob([response.data])
  },

  // DELETE /materials/{id} - Delete a material
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/materials/${id}`)
  },

  // GET /materials/subject/{subjectId} - Get materials by subject
  getBySubjectId: async (subjectId: number): Promise<Material[]> => {
    const response = await apiClient.get<Material[]>(`/materials/subject/${subjectId}`)
    return response.data
  },

  // GET /materials/{id}/can-download - Check if user can download
  canDownload: async (id: number): Promise<boolean> => {
    const response = await apiClient.get<CanDownloadResponse>(
      `/materials/${id}/can-download`
    )
    return response.data.canDownload
  },

  // GET /materials/recent - Get recent materials for current student
  getRecent: async (days: number = 3): Promise<Material[]> => {
    const response = await apiClient.get<Material[]>('/materials/recent', {
      params: { days },
    })
    return response.data
  },

  // PATCH /materials/{id} - Update material metadata + admin flags (ADMIN only)
  update: async (id: number, payload: UpdateMaterialRequest): Promise<Material> => {
    const response = await apiClient.patch<Material>(`/materials/${id}`, payload)
    return response.data
  },

  // PATCH /materials/batch/download-disabled - Batch toggle download (ADMIN only)
  batchSetDownloadDisabled: async (
    ids: number[],
    disabled: boolean
  ): Promise<BatchUpdateResponse> => {
    const response = await apiClient.patch<BatchUpdateResponse>(
      '/materials/batch/download-disabled',
      { ids, disabled }
    )
    return response.data
  },

  // PATCH /materials/batch/visibility - Batch toggle visibility (ADMIN only)
  batchSetVisibility: async (
    ids: number[],
    visible: boolean
  ): Promise<BatchUpdateResponse> => {
    const response = await apiClient.patch<BatchUpdateResponse>(
      '/materials/batch/visibility',
      { ids, visible }
    )
    return response.data
  },
}

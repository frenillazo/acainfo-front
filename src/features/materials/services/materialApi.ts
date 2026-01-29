import { apiClient } from '@/shared/services/apiClient'
import type { PageResponse } from '@/shared/types/api.types'
import type {
  Material,
  MaterialFilters,
  UploadMaterialRequest,
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

  // DELETE /materials/{id} - Delete a material
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/materials/${id}`)
  },

  // GET /materials - List materials with filters
  getAll: async (filters: MaterialFilters = {}): Promise<PageResponse<Material>> => {
    const response = await apiClient.get<PageResponse<Material>>('/materials', {
      params: filters,
    })
    return response.data
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
}

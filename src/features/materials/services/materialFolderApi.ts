import { apiClient } from '@/shared/services/apiClient'
import type {
  MaterialFolder,
  CreateMaterialFolderRequest,
  UpdateMaterialFolderRequest,
} from '../types/material.types'

export const materialFolderApi = {
  // GET /subjects/{subjectId}/material-folders - Folders of a subject ordered by position
  getBySubjectId: async (subjectId: number): Promise<MaterialFolder[]> => {
    const response = await apiClient.get<MaterialFolder[]>(
      `/subjects/${subjectId}/material-folders`
    )
    return response.data
  },

  // POST /subjects/{subjectId}/material-folders - Create a folder (ADMIN only)
  create: async (
    subjectId: number,
    payload: CreateMaterialFolderRequest
  ): Promise<MaterialFolder> => {
    const response = await apiClient.post<MaterialFolder>(
      `/subjects/${subjectId}/material-folders`,
      payload
    )
    return response.data
  },

  // PATCH /material-folders/{id} - Rename and/or reorder a folder (ADMIN only)
  update: async (
    id: number,
    payload: UpdateMaterialFolderRequest
  ): Promise<MaterialFolder> => {
    const response = await apiClient.patch<MaterialFolder>(
      `/material-folders/${id}`,
      payload
    )
    return response.data
  },

  // DELETE /material-folders/{id} - Delete a folder; its materials go to the root (ADMIN only)
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/material-folders/${id}`)
  },
}

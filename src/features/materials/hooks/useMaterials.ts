import { useState } from 'react'
import { materialApi } from '../services/materialApi'
import type { Material, MaterialFilters, UploadMaterialRequest } from '../types/material.types'
import type { PageResponse } from '@/shared/types/api.types'

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null)
  const [pageData, setPageData] = useState<PageResponse<Material> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  // Upload a material
  const upload = async (
    metadata: UploadMaterialRequest,
    file: File
  ): Promise<Material | null> => {
    setIsUploading(true)
    setError(null)

    try {
      const material = await materialApi.upload(metadata, file)
      // Add to local list if we have one
      if (materials.length > 0) {
        setMaterials((prev) => [material, ...prev])
      }
      return material
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to upload material'
      setError(message)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  // Get material by ID
  const getById = async (id: number): Promise<Material | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const material = await materialApi.getById(id)
      setCurrentMaterial(material)
      return material
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch material'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Download material
  const download = async (id: number, filename: string): Promise<boolean> => {
    setIsDownloading(true)
    setError(null)

    try {
      await materialApi.download(id, filename)
      return true
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to download material'
      setError(message)
      return false
    } finally {
      setIsDownloading(false)
    }
  }

  // Delete material
  const deleteMaterial = async (id: number): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      await materialApi.delete(id)
      // Remove from local list
      setMaterials((prev) => prev.filter((m) => m.id !== id))
      if (currentMaterial?.id === id) {
        setCurrentMaterial(null)
      }
      return true
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete material'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Get materials with filters (paginated)
  const getAll = async (filters: MaterialFilters = {}): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await materialApi.getAll(filters)
      setPageData(result)
      setMaterials(result.content)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch materials'
      setError(message)
      setMaterials([])
    } finally {
      setIsLoading(false)
    }
  }

  // Get materials by subject
  const getBySubjectId = async (subjectId: number): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await materialApi.getBySubjectId(subjectId)
      setMaterials(result)
      setPageData(null) // Clear pagination data
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to fetch materials'
      setError(message)
      setMaterials([])
    } finally {
      setIsLoading(false)
    }
  }

  // Check if user can download
  const canDownload = async (id: number): Promise<boolean> => {
    try {
      return await materialApi.canDownload(id)
    } catch (err) {
      return false
    }
  }

  return {
    materials,
    currentMaterial,
    pageData,
    isLoading,
    isUploading,
    isDownloading,
    error,
    clearError,
    upload,
    getById,
    download,
    deleteMaterial,
    getAll,
    getBySubjectId,
    canDownload,
  }
}

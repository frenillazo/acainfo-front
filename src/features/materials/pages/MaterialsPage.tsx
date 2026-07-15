import { useState } from 'react'
import { useAuthStore } from '@/features/auth'
import { useMaterialsList } from '../hooks/useMaterials'
import {
  useUploadMaterial,
  useDeleteMaterial,
  useDownloadMaterial,
} from '../hooks/useMaterialMutations'
import { useMaterialViewer } from '../hooks/useMaterialViewer'
import { MaterialCard } from '../components/MaterialCard'
import { MaterialUploadForm } from '../components/MaterialUploadForm'
import { MaterialViewerModal } from '../components/MaterialViewer'
import { getApiErrorMessage } from '@/shared/utils/apiError'
import type { Material, UploadMaterialRequest } from '../types/material.types'

export function MaterialsPage() {
  const user = useAuthStore((state) => state.user)
  const isAdminOrTeacher = user?.roles.some((r) => r === 'ADMIN' || r === 'TEACHER')

  const [showUploadForm, setShowUploadForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExtension, setSelectedExtension] = useState('')

  // Los filtros forman parte de la query key: cambiar página/búsqueda/tipo
  // refetchea solo, sin recargas manuales.
  const { data: pageData, isLoading, error: listError } = useMaterialsList({
    page: currentPage,
    size: 12,
    searchTerm: searchTerm || undefined,
    fileExtension: selectedExtension || undefined,
    sortBy: 'uploadedAt',
    sortDirection: 'DESC',
  })
  const materials = pageData?.content ?? []

  const uploadMutation = useUploadMaterial()
  const deleteMutation = useDeleteMaterial()
  const downloadMutation = useDownloadMaterial()

  const {
    isOpen: viewerOpen,
    material: viewerMaterial,
    content: viewerContent,
    viewerType,
    isLoading: viewerLoading,
    error: viewerError,
    openViewer,
    closeViewer,
  } = useMaterialViewer()

  const mutationError = uploadMutation.error ?? deleteMutation.error ?? downloadMutation.error
  const error = mutationError
    ? getApiErrorMessage(mutationError, 'No se pudo completar la operación')
    : listError
      ? getApiErrorMessage(listError, 'No se pudieron cargar los materiales')
      : null
  const clearError = () => {
    uploadMutation.reset()
    deleteMutation.reset()
    downloadMutation.reset()
  }

  const handleUpload = async (metadata: UploadMaterialRequest, file: File) => {
    try {
      await uploadMutation.mutateAsync({ metadata, file })
      setShowUploadForm(false)
    } catch {
      // el error se muestra en el banner vía uploadMutation.error
    }
  }

  const handleView = (material: Material) => {
    openViewer(material)
  }

  const handleViewerDownload = () => {
    if (viewerMaterial) {
      downloadMutation.mutate({ id: viewerMaterial.id, filename: viewerMaterial.originalFilename })
    }
  }

  const handleDownload = (id: number, filename: string) => {
    downloadMutation.mutate({ id, filename })
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0) // Reset to first page
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  // Get unique extensions for filter
  const extensions = Array.from(
    new Set(materials.map((m) => m.fileExtension))
  ).sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materiales</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consulta y descarga el material de tus asignaturas
          </p>
        </div>

        {isAdminOrTeacher && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showUploadForm ? 'Cancelar' : 'Subir material'}
          </button>
        )}
      </div>

      {/* Upload Form */}
      {showUploadForm && isAdminOrTeacher && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Subir nuevo material</h2>
          <MaterialUploadForm
            onSubmit={handleUpload}
            onCancel={() => setShowUploadForm(false)}
            isLoading={uploadMutation.isPending}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={clearError}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
              >
                <span className="sr-only">Cerrar</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar materiales..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="w-48">
            <select
              value={selectedExtension}
              onChange={(e) => {
                setSelectedExtension(e.target.value)
                setCurrentPage(0)
              }}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              {extensions.map((ext) => (
                <option key={ext} value={ext}>
                  .{ext}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Materials List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : materials.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay materiales</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedExtension
              ? 'Prueba a ajustar los filtros'
              : 'Todavía no se ha subido ningún material'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onView={handleView}
                onDownload={handleDownload}
                onDelete={handleDelete}
                canDelete={isAdminOrTeacher}
                isDownloading={downloadMutation.isPending}
                showFolderBadge={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {pageData && pageData.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={pageData.first}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={pageData.last}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{' '}
                    <span className="font-medium">
                      {pageData.page * pageData.size + 1}
                    </span>{' '}
                    a{' '}
                    <span className="font-medium">
                      {Math.min(
                        (pageData.page + 1) * pageData.size,
                        pageData.totalElements
                      )}
                    </span>{' '}
                    de <span className="font-medium">{pageData.totalElements}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={pageData.first}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={pageData.last}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Material Viewer Modal */}
      <MaterialViewerModal
        isOpen={viewerOpen}
        material={viewerMaterial}
        content={viewerContent}
        viewerType={viewerType}
        isLoading={viewerLoading}
        error={viewerError}
        onClose={closeViewer}
        onDownload={handleViewerDownload}
      />
    </div>
  )
}

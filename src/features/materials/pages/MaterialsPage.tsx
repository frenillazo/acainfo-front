import { useEffect, useState } from 'react'
import { useAuthStore } from '@/features/auth'
import { useMaterials } from '../hooks/useMaterials'
import { useMaterialViewer } from '../hooks/useMaterialViewer'
import { MaterialCard } from '../components/MaterialCard'
import { MaterialUploadForm } from '../components/MaterialUploadForm'
import { MaterialViewerModal } from '../components/MaterialViewer'
import type { Material, UploadMaterialRequest } from '../types/material.types'

export function MaterialsPage() {
  const user = useAuthStore((state) => state.user)
  const isAdminOrTeacher = user?.roles.some((r) => r === 'ADMIN' || r === 'TEACHER')

  const {
    materials,
    pageData,
    isLoading,
    isUploading,
    isDownloading,
    error,
    clearError,
    upload,
    download,
    deleteMaterial,
    getAll,
  } = useMaterials()

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

  const [showUploadForm, setShowUploadForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExtension, setSelectedExtension] = useState('')

  // Load materials on mount and when filters change
  useEffect(() => {
    loadMaterials()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, selectedExtension])

  const loadMaterials = () => {
    getAll({
      page: currentPage,
      size: 12,
      searchTerm: searchTerm || undefined,
      fileExtension: selectedExtension || undefined,
      sortBy: 'uploadedAt',
      sortDirection: 'DESC',
    })
  }

  const handleUpload = async (metadata: UploadMaterialRequest, file: File) => {
    const material = await upload(metadata, file)
    if (material) {
      setShowUploadForm(false)
      // Reload to show new material
      loadMaterials()
    }
  }

  const handleView = (material: Material) => {
    openViewer(material)
  }

  const handleViewerDownload = () => {
    if (viewerMaterial) {
      download(viewerMaterial.id, viewerMaterial.originalFilename)
    }
  }

  const handleDownload = async (id: number, filename: string) => {
    await download(id, filename)
  }

  const handleDelete = async (id: number) => {
    const success = await deleteMaterial(id)
    if (success) {
      // Reload list
      loadMaterials()
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(0) // Reset to first page
    loadMaterials()
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
          <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and download course materials
          </p>
        </div>

        {isAdminOrTeacher && (
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {showUploadForm ? 'Cancel' : 'Upload Material'}
          </button>
        )}
      </div>

      {/* Upload Form */}
      {showUploadForm && isAdminOrTeacher && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Upload New Material</h2>
          <MaterialUploadForm
            onSubmit={handleUpload}
            onCancel={() => setShowUploadForm(false)}
            isLoading={isUploading}
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
                <span className="sr-only">Dismiss</span>
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
              placeholder="Search materials..."
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
              <option value="">All types</option>
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
            Search
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">No materials found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedExtension
              ? 'Try adjusting your filters'
              : 'No materials have been uploaded yet'}
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
                isDownloading={isDownloading}
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
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={pageData.last}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {pageData.page * pageData.size + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(
                        (pageData.page + 1) * pageData.size,
                        pageData.totalElements
                      )}
                    </span>{' '}
                    of <span className="font-medium">{pageData.totalElements}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={pageData.first}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={pageData.last}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
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

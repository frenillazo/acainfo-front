import { useState, useRef, useEffect } from 'react'
import type { UploadMaterialRequest } from '../types/material.types'
import { MaterialCategory } from '../types/material.types'
import { CategorySelector } from './CategorySelector'

interface MaterialUploadFormProps {
  subjectId?: number
  subjects?: Array<{ id: number; name: string }>
  onSubmit: (metadata: UploadMaterialRequest, file: File) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export function MaterialUploadForm({
  subjectId,
  subjects = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: MaterialUploadFormProps) {
  const [formData, setFormData] = useState<UploadMaterialRequest>({
    subjectId: subjectId || 0,
    name: '',
    description: '',
    category: MaterialCategory.OTROS,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationErrors, setValidationErrors] = useState<{
    subjectId?: string
    name?: string
    file?: string
  }>({})
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set subject if provided
  useEffect(() => {
    if (subjectId) {
      setFormData((prev) => ({ ...prev, subjectId }))
    }
  }, [subjectId])

  const validateForm = (): boolean => {
    const errors: { subjectId?: string; name?: string; file?: string } = {}

    if (!formData.subjectId || formData.subjectId === 0) {
      errors.subjectId = 'Please select a subject'
    }

    if (!formData.name.trim()) {
      errors.name = 'Material name is required'
    } else if (formData.name.length > 200) {
      errors.name = 'Name must not exceed 200 characters'
    }

    if (!selectedFile) {
      errors.file = 'Please select a file to upload'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !selectedFile) {
      return
    }

    await onSubmit(formData, selectedFile)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Auto-fill name if empty
      if (!formData.name) {
        setFormData((prev) => ({
          ...prev,
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        }))
      }
      setValidationErrors((prev) => ({ ...prev, file: undefined }))
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Auto-fill name if empty
      if (!formData.name) {
        setFormData((prev) => ({
          ...prev,
          name: file.name.replace(/\.[^/.]+$/, ''),
        }))
      }
      setValidationErrors((prev) => ({ ...prev, file: undefined }))
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Subject Selection (if not pre-selected) */}
      {!subjectId && subjects.length > 0 && (
        <div>
          <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <select
            id="subjectId"
            value={formData.subjectId}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                subjectId: parseInt(e.target.value),
              }))
            }
            className={`mt-1 block w-full rounded-md border ${
              validationErrors.subjectId ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            disabled={isLoading}
          >
            <option value={0}>Select a subject...</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {validationErrors.subjectId && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.subjectId}</p>
          )}
        </div>
      )}

      {/* File Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700">File</label>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`mt-1 flex justify-center rounded-md border-2 border-dashed px-6 py-10 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : validationErrors.file
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        >
          <div className="text-center">
            {!selectedFile ? (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4 flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">Any file type up to 10MB</p>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  📄
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="rounded-md p-1 text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        {validationErrors.file && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.file}</p>
        )}
      </div>

      {/* Material Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Material Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          maxLength={200}
          className={`mt-1 block w-full rounded-md border ${
            validationErrors.name ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
          disabled={isLoading}
          placeholder="e.g., Chapter 3 - Calculus Notes"
        />
        {validationErrors.name && (
          <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
        )}
      </div>

      {/* Category Selection */}
      <CategorySelector
        value={formData.category || MaterialCategory.OTROS}
        onChange={(category) =>
          setFormData((prev) => ({ ...prev, category }))
        }
        disabled={isLoading}
      />

      {/* Description (Optional) */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
          maxLength={500}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isLoading}
          placeholder="Add a brief description of the material..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading || !selectedFile}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Uploading...' : 'Upload Material'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

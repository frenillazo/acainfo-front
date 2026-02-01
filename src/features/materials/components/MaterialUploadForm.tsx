import { useState, useEffect } from 'react'
import type { UploadMaterialRequest } from '../types/material.types'
import { MaterialCategory } from '../types/material.types'
import { CategorySelector } from './CategorySelector'
import {
  FileUpload,
  FormFieldControlled,
  FormSelectControlled,
  FormTextareaControlled,
} from '@/shared/components/form'
import { Button } from '@/shared/components/ui'

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

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
    // Auto-fill name if empty
    if (file && !formData.name) {
      setFormData((prev) => ({
        ...prev,
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      }))
    }
    setValidationErrors((prev) => ({ ...prev, file: undefined }))
  }

  const subjectOptions = subjects.map((subject) => ({
    value: subject.id,
    label: subject.name,
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Subject Selection (if not pre-selected) */}
      {!subjectId && subjects.length > 0 && (
        <FormSelectControlled
          label="Subject"
          name="subjectId"
          value={formData.subjectId.toString()}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              subjectId: parseInt(value),
            }))
          }
          options={subjectOptions}
          placeholder="Select a subject..."
          error={validationErrors.subjectId}
          disabled={isLoading}
        />
      )}

      {/* File Upload Area */}
      <FileUpload
        label="File"
        value={selectedFile}
        onChange={handleFileChange}
        error={validationErrors.file}
        disabled={isLoading}
        helperText="Any file type up to 10MB"
      />

      {/* Material Name */}
      <FormFieldControlled
        label="Material Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
        maxLength={200}
        error={validationErrors.name}
        disabled={isLoading}
        placeholder="e.g., Chapter 3 - Calculus Notes"
      />

      {/* Category Selection */}
      <CategorySelector
        value={formData.category || MaterialCategory.OTROS}
        onChange={(category) => setFormData((prev) => ({ ...prev, category }))}
        disabled={isLoading}
      />

      {/* Description (Optional) */}
      <FormTextareaControlled
        label="Description (Optional)"
        name="description"
        value={formData.description || ''}
        onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
        rows={3}
        maxLength={500}
        disabled={isLoading}
        placeholder="Add a brief description of the material..."
      />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!selectedFile}
          isLoading={isLoading}
          loadingText="Uploading..."
          className="flex-1"
        >
          Upload Material
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

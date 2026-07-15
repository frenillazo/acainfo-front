import { useState } from 'react'
import type { UploadMaterialRequest } from '../types/material.types'
import { FolderSelector } from './FolderSelector'
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
    folderId: null,
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationErrors, setValidationErrors] = useState<{
    subjectId?: string
    name?: string
    file?: string
  }>({})

  // Las carpetas son por asignatura: la fijada por el padre o la elegida en el form
  const effectiveSubjectId = subjectId || formData.subjectId || 0

  const validateForm = (): boolean => {
    const errors: { subjectId?: string; name?: string; file?: string } = {}

    if (!formData.subjectId || formData.subjectId === 0) {
      errors.subjectId = 'Selecciona una asignatura'
    }

    if (!formData.name.trim()) {
      errors.name = 'El nombre del material es obligatorio'
    } else if (formData.name.length > 200) {
      errors.name = 'El nombre no puede exceder 200 caracteres'
    }

    if (!selectedFile) {
      errors.file = 'Selecciona un archivo para subir'
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
          label="Asignatura"
          name="subjectId"
          value={formData.subjectId.toString()}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              subjectId: parseInt(value),
              // Al cambiar de asignatura la carpeta elegida deja de ser válida
              folderId: null,
            }))
          }
          options={subjectOptions}
          placeholder="Selecciona una asignatura..."
          error={validationErrors.subjectId}
          disabled={isLoading}
        />
      )}

      {/* File Upload Area */}
      <FileUpload
        label="Archivo"
        value={selectedFile}
        onChange={handleFileChange}
        error={validationErrors.file}
        disabled={isLoading}
        helperText="Cualquier tipo de archivo hasta 10MB"
      />

      {/* Material Name */}
      <FormFieldControlled
        label="Nombre del material"
        name="name"
        type="text"
        value={formData.name}
        onChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
        maxLength={200}
        error={validationErrors.name}
        disabled={isLoading}
        placeholder="p. ej., Tema 3 - Apuntes de Cálculo"
      />

      {/* Folder Selection */}
      <FolderSelector
        subjectId={effectiveSubjectId}
        value={formData.folderId ?? null}
        onChange={(folderId) => setFormData((prev) => ({ ...prev, folderId }))}
        disabled={isLoading}
      />

      {/* Description (Optional) */}
      <FormTextareaControlled
        label="Descripción (opcional)"
        name="description"
        value={formData.description || ''}
        onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
        rows={3}
        maxLength={500}
        disabled={isLoading}
        placeholder="Añade una breve descripción del material..."
      />

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={!selectedFile}
          isLoading={isLoading}
          loadingText="Subiendo..."
          className="flex-1"
        >
          Subir material
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}

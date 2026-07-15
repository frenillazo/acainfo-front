import { useState, useRef } from 'react'
import { cn } from '@/shared/utils/cn'
import { formatFileSize } from '@/shared/utils/formatters'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { IconButton } from '../ui/IconButton'

interface MultiFileUploadProps {
  label?: string
  value: File[]
  onChange: (files: File[]) => void
  error?: string
  accept?: string
  disabled?: boolean
  helperText?: string
}

/**
 * Selector de VARIOS archivos (drag & drop o click), pensado para lotes de
 * capturas. Añade a la selección existente; cada archivo se puede quitar.
 * FileUpload (mono-archivo) queda intacto para el resto de formularios.
 */
export function MultiFileUpload({
  label,
  value,
  onChange,
  error,
  accept,
  disabled = false,
  helperText = 'Varias imágenes (JPEG, PNG, WebP)',
}: MultiFileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    onChange([...value, ...Array.from(files)])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
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
    if (disabled) return
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'mt-1 rounded-md border-2 border-dashed px-6 py-6 transition-colors',
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
              ? 'border-red-500'
              : 'border-gray-300',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div className="text-center">
          <Upload className="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
          <div className="mt-3 flex justify-center text-sm text-gray-600">
            <label
              htmlFor="multi-file-upload"
              className={cn(
                'relative cursor-pointer rounded-md bg-white font-medium text-blue-600',
                'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
                'hover:text-blue-500',
                disabled && 'cursor-not-allowed'
              )}
            >
              <span>Añadir archivos</span>
              <input
                ref={fileInputRef}
                id="multi-file-upload"
                name="multi-file-upload"
                type="file"
                multiple
                className="sr-only"
                onChange={(e) => addFiles(e.target.files)}
                disabled={disabled}
                accept={accept}
              />
            </label>
            <p className="pl-1">o arrástralos aquí</p>
          </div>
          <p className="text-xs text-gray-500">{helperText}</p>
        </div>

        {value.length > 0 && (
          <ul className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
            {value.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center gap-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <ImageIcon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <IconButton
                  icon={<X className="h-4 w-4" />}
                  label={`Quitar ${file.name}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAt(index)}
                  disabled={disabled}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

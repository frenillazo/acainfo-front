import { useState, useRef } from 'react'
import { cn } from '@/shared/utils/cn'
import { formatFileSize } from '@/shared/utils/formatters'
import { Upload, X, FileText } from 'lucide-react'
import { IconButton } from '../ui/IconButton'

/** El back acepta hasta 20MB (multipart), pero nginx y Cloudflare van justos. */
export const DEFAULT_MAX_FILE_SIZE = 20 * 1024 * 1024

interface FileUploadProps {
  label?: string
  value: File | null
  onChange: (file: File | null) => void
  error?: string
  accept?: string
  maxSize?: number
  disabled?: boolean
  helperText?: string
}

export function FileUpload({
  label,
  value,
  onChange,
  error,
  accept,
  maxSize = DEFAULT_MAX_FILE_SIZE,
  disabled = false,
  helperText = `Cualquier tipo de archivo, hasta ${formatFileSize(DEFAULT_MAX_FILE_SIZE)}`,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /** ¿Coincide con `accept` ("application/pdf,.png,image/*")? */
  const matchesAccept = (file: File): boolean => {
    if (!accept) return true
    return accept.split(',').some((raw) => {
      const rule = raw.trim().toLowerCase()
      if (!rule) return false
      if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule)
      if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1))
      return file.type.toLowerCase() === rule
    })
  }

  const handleFileChange = (file: File | undefined) => {
    if (!file) return

    // Antes se hacía `return` sin decir nada: el usuario soltaba el archivo,
    // no pasaba nada y creía que lo había adjuntado. Y como nadie pasaba
    // maxSize, un fichero enorme se enviaba y petaba en el servidor.
    if (maxSize && file.size > maxSize) {
      setLocalError(
        `El archivo pesa ${formatFileSize(file.size)} y el máximo son ${formatFileSize(maxSize)}.`
      )
      return
    }
    // El drop no miraba `accept`: por arrastre entraba cualquier tipo.
    if (!matchesAccept(file)) {
      setLocalError('Ese tipo de archivo no se admite aquí.')
      return
    }

    setLocalError(null)
    onChange(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0])
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
    handleFileChange(e.dataTransfer.files?.[0])
  }

  const handleClear = () => {
    setLocalError(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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
          'mt-1 flex justify-center rounded-md border-2 border-dashed px-6 py-10 transition-colors',
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
              ? 'border-red-500'
              : 'border-gray-300',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <div className="text-center">
          {!value ? (
            <>
              <Upload
                className="mx-auto h-12 w-12 text-gray-400"
                aria-hidden="true"
              />
              <div className="mt-4 flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className={cn(
                    'relative cursor-pointer rounded-md bg-white font-medium text-blue-600',
                    'focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2',
                    'hover:text-blue-500',
                    disabled && 'cursor-not-allowed'
                  )}
                >
                  <span>Elegir archivo</span>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleInputChange}
                    disabled={disabled}
                    accept={accept}
                  />
                </label>
                <p className="pl-1">o arrástralo aquí</p>
              </div>
              <p className="text-xs text-gray-500">{helperText}</p>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900">{value.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(value.size)}</p>
              </div>
              <IconButton
                icon={<X className="h-5 w-5" />}
                label="Quitar archivo"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>
      {(error ?? localError) && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error ?? localError}
        </p>
      )}
    </div>
  )
}

import { useState, useRef } from 'react'
import { cn } from '@/shared/utils/cn'
import { Upload, X, FileText } from 'lucide-react'
import { IconButton } from '../ui/IconButton'

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

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function FileUpload({
  label,
  value,
  onChange,
  error,
  accept,
  maxSize,
  disabled = false,
  helperText = 'Any file type up to 10MB',
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      if (maxSize && file.size > maxSize) {
        return
      }
      onChange(file)
    }
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
                  <span>Upload a file</span>
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
                <p className="pl-1">or drag and drop</p>
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
                label="Remove file"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

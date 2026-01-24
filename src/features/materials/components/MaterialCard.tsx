import { useState } from 'react'
import type { Material } from '../types/material.types'
import { getFileIcon, CATEGORY_ICONS } from '../types/material.types'
import { cn } from '@/shared/utils/cn'

interface MaterialCardProps {
  material: Material
  onDownload?: (id: number, filename: string) => void
  onDelete?: (id: number) => void
  canDelete?: boolean
  isDownloading?: boolean
}

export function MaterialCard({
  material,
  onDownload,
  onDelete,
  canDelete = false,
  isDownloading = false,
}: MaterialCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDownload = () => {
    onDownload?.(material.id, material.originalFilename)
  }

  const handleDelete = () => {
    onDelete?.(material.id)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        {/* File Icon */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-2xl">
          {getFileIcon(material.fileExtension)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{material.name}</h3>

          {material.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {material.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
              {CATEGORY_ICONS[material.category]} {material.categoryDisplayName}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5">
              .{material.fileExtension}
            </span>
            <span>{material.fileSizeFormatted}</span>
            <span>•</span>
            <span>{material.subjectName}</span>
          </div>

          <div className="mt-2 text-xs text-gray-400">
            Uploaded by {material.uploadedByName} •{' '}
            {new Date(material.uploadedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={cn(
              'rounded-md p-2 text-blue-600 hover:bg-blue-50',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
            title="Download"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>

          {canDelete && (
            <>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-md p-2 text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <button
                    onClick={handleDelete}
                    className="rounded-md bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

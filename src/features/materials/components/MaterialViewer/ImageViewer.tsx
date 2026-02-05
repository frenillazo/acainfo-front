import { useMemo, useState, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'
import { ZoomIn, ZoomOut } from 'lucide-react'

interface ImageViewerProps {
  content: Blob
  alt: string
}

export function ImageViewer({ content, alt }: ImageViewerProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  const imageUrl = useMemo(() => {
    return URL.createObjectURL(content)
  }, [content])

  useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl)
  }, [imageUrl])

  return (
    <div className="flex flex-col items-center">
      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {isZoomed ? (
            <>
              <ZoomOut className="h-4 w-4" />
              Reducir
            </>
          ) : (
            <>
              <ZoomIn className="h-4 w-4" />
              Ampliar
            </>
          )}
        </button>
      </div>

      {/* Image Container */}
      <div
        className={cn(
          'relative overflow-auto rounded-lg border border-gray-200 bg-gray-100',
          isZoomed ? 'max-h-[75vh] max-w-full' : 'max-h-[65vh]'
        )}
      >
        <img
          src={imageUrl}
          alt={alt}
          className={cn(
            'transition-transform duration-200',
            isZoomed
              ? 'max-w-none cursor-zoom-out'
              : 'max-h-[65vh] cursor-zoom-in object-contain'
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        />
      </div>
    </div>
  )
}

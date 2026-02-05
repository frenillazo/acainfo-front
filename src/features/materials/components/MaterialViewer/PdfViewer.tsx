import { useMemo, useEffect } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface PdfViewerProps {
  content: Blob
}

export function PdfViewer({ content }: PdfViewerProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0]], // Solo thumbnails
    toolbarPlugin: {
      fullScreenPlugin: { enableShortcuts: true },
      zoomPlugin: { enableShortcuts: true },
    },
  })

  const fileUrl = useMemo(() => {
    return URL.createObjectURL(content)
  }, [content])

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => URL.revokeObjectURL(fileUrl)
  }, [fileUrl])

  return (
    <div className="h-[70vh] w-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import type { ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/default-layout'
// Worker de pdf.js autohospedado (asset propio, sin CDN externo). La versión
// la fija pdfjs-dist en package.json y DEBE coincidir con la que usa
// @react-pdf-viewer/core (peer dep).
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url'

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface PdfViewerProps {
  content: Blob
  /** false = material con descarga deshabilitada: sin Download ni Print. */
  allowDownload: boolean
}

const hidden = () => <></>

export function PdfViewer({ content, allowDownload }: PdfViewerProps) {
  // La toolbar por defecto trae Download/Print/Open. "Open" (abrir un archivo
  // local) no pinta nada dentro de la app y se quita siempre; Download y
  // Print solo se ofrecen si el material permite descarga (el blob completo
  // está en el navegador: esto elimina la vía fácil, no es un DRM).
  const transform = (slot: ToolbarSlot): ToolbarSlot => ({
    ...slot,
    Open: hidden,
    OpenMenuItem: hidden,
    ...(allowDownload
      ? {}
      : {
          Download: hidden,
          DownloadMenuItem: hidden,
          Print: hidden,
          PrintMenuItem: hidden,
        }),
  })

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [defaultTabs[0]], // Solo thumbnails
    renderToolbar: (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
      <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    ),
    toolbarPlugin: {
      fullScreenPlugin: { enableShortcuts: true },
      zoomPlugin: { enableShortcuts: true },
      // Sin descarga tampoco Ctrl+P del visor
      printPlugin: { enableShortcuts: allowDownload },
    },
  })
  const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance

  // Blob URL creado y revocado en el MISMO effect: seguro bajo StrictMode
  // (con useMemo + cleanup, el double-effect de dev revocaba la URL memoizada
  // y el visor se quedaba en blanco).
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  useEffect(() => {
    const url = URL.createObjectURL(content)
    // Excepción legítima a set-state-in-effect: el recurso DEBE crearse en el
    // effect (cada setup crea su URL y su cleanup la revoca) y comunicarse al
    // render vía estado; un solo re-render extra al abrir el visor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFileUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [content])

  if (!fileUrl) return null

  return (
    <div className="h-[70vh] w-full">
      <Worker workerUrl={workerUrl}>
        <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  )
}

// Types
export type { Material, MaterialFilters, UploadMaterialRequest, CanDownloadResponse, ViewerType, ViewerState } from './types/material.types'
export { FILE_CATEGORIES, getFileCategory, getFileIcon, getViewerType, CODE_LANGUAGE_MAP } from './types/material.types'

// Services
export { materialApi } from './services/materialApi'

// Hooks
export { useMaterials } from './hooks/useMaterials'
export { useMaterialViewer } from './hooks/useMaterialViewer'

// Components
export { MaterialCard } from './components/MaterialCard'
export { MaterialUploadForm } from './components/MaterialUploadForm'
export { MaterialViewer, MaterialViewerModal, PdfViewer, CodeViewer, ImageViewer, FallbackViewer } from './components/MaterialViewer'

// Pages
export { MaterialsPage } from './pages/MaterialsPage'

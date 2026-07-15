// Types
export type { Material, MaterialFolder, MaterialFilters, UploadMaterialRequest, CanDownloadResponse, ViewerType, ViewerState } from './types/material.types'
export { FILE_CATEGORIES, getFileCategory, getFileIcon, getViewerType, CODE_LANGUAGE_MAP } from './types/material.types'

// Services
export { materialApi } from './services/materialApi'
export { materialFolderApi } from './services/materialFolderApi'

// Hooks
export { materialKeys, useMaterialsList, useMaterialsBySubject, useRecentMaterials } from './hooks/useMaterials'
export {
  materialFolderKeys,
  useMaterialFoldersBySubject,
  useCreateMaterialFolder,
  useUpdateMaterialFolder,
  useDeleteMaterialFolder,
} from './hooks/useMaterialFolders'
export {
  useUploadMaterial,
  useDeleteMaterial,
  useUpdateMaterial,
  useBatchSetDownloadDisabled,
  useBatchSetVisibility,
  useDownloadMaterial,
} from './hooks/useMaterialMutations'
export { useMaterialViewer } from './hooks/useMaterialViewer'

// Components
export { MaterialCard } from './components/MaterialCard'
export { MaterialUploadForm } from './components/MaterialUploadForm'
export { FolderSelector } from './components/FolderSelector'
export { MaterialsGroupedByFolder } from './components/MaterialsGroupedByFolder'
export { MaterialFolderManager } from './components/MaterialFolderManager'
export { MaterialViewer, MaterialViewerModal, PdfViewer, CodeViewer, ImageViewer, FallbackViewer } from './components/MaterialViewer'

// Pages
export { MaterialsPage } from './pages/MaterialsPage'

// Material categories enum
export enum MaterialCategory {
  TEORIA = 'TEORIA',
  EJERCICIOS = 'EJERCICIOS',
  EXAMENES = 'EXAMENES',
  PROYECTOS = 'PROYECTOS',
  LABORATORIOS = 'LABORATORIOS',
  OTROS = 'OTROS',
}

// Category labels for UI
export const CATEGORY_LABELS: Record<MaterialCategory, string> = {
  [MaterialCategory.TEORIA]: 'Teoría',
  [MaterialCategory.EJERCICIOS]: 'Ejercicios',
  [MaterialCategory.EXAMENES]: 'Exámenes',
  [MaterialCategory.PROYECTOS]: 'Proyectos',
  [MaterialCategory.LABORATORIOS]: 'Laboratorios',
  [MaterialCategory.OTROS]: 'Otros',
}

// Category icons
export const CATEGORY_ICONS: Record<MaterialCategory, string> = {
  [MaterialCategory.TEORIA]: '📚',
  [MaterialCategory.EJERCICIOS]: '✏️',
  [MaterialCategory.EXAMENES]: '📝',
  [MaterialCategory.PROYECTOS]: '🚀',
  [MaterialCategory.LABORATORIOS]: '🔬',
  [MaterialCategory.OTROS]: '📁',
}

// Material entity with enriched data from backend
export interface Material {
  id: number
  subjectId: number
  uploadedById: number
  name: string
  description: string | null
  category: MaterialCategory
  categoryDisplayName: string
  originalFilename: string
  fileExtension: string
  mimeType: string
  fileSize: number
  fileSizeFormatted: string
  isCodeFile: boolean
  isDocumentFile: boolean
  uploadedAt: string
  createdAt: string
  updatedAt: string
  // Admin flags
  visible: boolean
  downloadDisabled: boolean
  visibilityEnabledAt: string | null
  downloadEnabledAt: string | null
  // Enriched data from related entities
  subjectName: string
  uploadedByName: string
}

// Filters for listing materials
export interface MaterialFilters {
  subjectId?: number
  uploadedById?: number
  fileExtension?: string
  searchTerm?: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

// Request DTOs
export interface UploadMaterialRequest {
  subjectId: number
  name: string
  description?: string | null
  category?: MaterialCategory
}

// Admin: update single material (all fields optional, null keeps the current value)
export interface UpdateMaterialRequest {
  name?: string
  description?: string | null
  visible?: boolean
  downloadDisabled?: boolean
}

// Admin: batch operations
export interface BatchDownloadDisabledRequest {
  ids: number[]
  disabled: boolean
}

export interface BatchVisibilityRequest {
  ids: number[]
  visible: boolean
}

export interface BatchUpdateResponse {
  updated: number
}

// Response DTOs
export interface CanDownloadResponse {
  canDownload: boolean
}

// Common file type categories
export const FILE_CATEGORIES = {
  DOCUMENT: ['pdf', 'doc', 'docx', 'txt', 'odt'],
  SPREADSHEET: ['xls', 'xlsx', 'csv', 'ods'],
  PRESENTATION: ['ppt', 'pptx', 'odp'],
  IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
  VIDEO: ['mp4', 'avi', 'mov', 'wmv', 'webm'],
  AUDIO: ['mp3', 'wav', 'ogg', 'aac'],
  CODE: ['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'php'],
  ARCHIVE: ['zip', 'rar', '7z', 'tar', 'gz'],
} as const

// Helper to get file category
export function getFileCategory(extension: string): string {
  const ext = extension.toLowerCase()
  for (const [category, extensions] of Object.entries(FILE_CATEGORIES)) {
    if ((extensions as readonly string[]).includes(ext)) {
      return category
    }
  }
  return 'OTHER'
}

// Helper to get file icon based on extension
export function getFileIcon(extension: string): string {
  const category = getFileCategory(extension)
  switch (category) {
    case 'DOCUMENT':
      return '📄'
    case 'SPREADSHEET':
      return '📊'
    case 'PRESENTATION':
      return '📽️'
    case 'IMAGE':
      return '🖼️'
    case 'VIDEO':
      return '🎥'
    case 'AUDIO':
      return '🎵'
    case 'CODE':
      return '💻'
    case 'ARCHIVE':
      return '📦'
    default:
      return '📁'
  }
}

// ============================================
// Material Viewer Types
// ============================================

export type ViewerType = 'pdf' | 'code' | 'image' | 'unsupported'

export interface ViewerState {
  isOpen: boolean
  material: Material | null
  content: Blob | string | null
  isLoading: boolean
  error: string | null
}

// Mapeo extensión → lenguaje shiki
export const CODE_LANGUAGE_MAP: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  php: 'php',
  rb: 'ruby',
  swift: 'swift',
  kt: 'kotlin',
  sql: 'sql',
  json: 'json',
  xml: 'xml',
  html: 'html',
  css: 'css',
  md: 'markdown',
  yaml: 'yaml',
  yml: 'yaml',
  sh: 'bash',
  bash: 'bash',
  txt: 'text',
}

// Helper para determinar tipo de viewer
export function getViewerType(extension: string): ViewerType {
  const ext = extension.toLowerCase()

  if (ext === 'pdf') return 'pdf'
  if (FILE_CATEGORIES.CODE.includes(ext as (typeof FILE_CATEGORIES.CODE)[number])) return 'code'
  if (FILE_CATEGORIES.IMAGE.includes(ext as (typeof FILE_CATEGORIES.IMAGE)[number])) return 'image'
  // txt y md también se pueden ver como código
  if (ext === 'txt' || ext === 'md') return 'code'

  return 'unsupported'
}

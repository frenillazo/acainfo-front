import {
  File,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Presentation,
  type LucideIcon,
} from 'lucide-react'

// Carpeta de materiales por asignatura (un solo nivel; null en Material.folderId = raíz)
export interface MaterialFolder {
  id: number
  subjectId: number
  name: string
  position: number
  createdAt: string
  updatedAt: string
}

// Material entity with enriched data from backend
export interface Material {
  id: number
  subjectId: number
  uploadedById: number
  name: string
  description: string | null
  // Carpeta a la que pertenece (null = raíz de la asignatura)
  folderId: number | null
  // Año de inicio del curso académico (2025 = curso "2025-26", corte sep→ago)
  academicYear: number
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
  folderName: string | null
}

// Request DTOs
export interface UploadMaterialRequest {
  subjectId: number
  name: string
  description?: string | null
  folderId?: number | null
}

// Admin: update single material (all fields optional, null keeps the current value)
// Mover a raíz = clearFolder: true (null en folderId significa "no cambiar", patrón clearYear)
export interface UpdateMaterialRequest {
  name?: string
  description?: string | null
  visible?: boolean
  downloadDisabled?: boolean
  academicYear?: number
  folderId?: number
  clearFolder?: boolean
}

// Carpetas: requests espejo de los DTOs del back
export interface CreateMaterialFolderRequest {
  name: string
}

export interface UpdateMaterialFolderRequest {
  name?: string
  position?: number
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

// ============================================
// Generador/transcriptor LaTeX con IA (espejo de MaterialAiJobResponse)
// ============================================

export type MaterialAiJobType = 'GENERATE' | 'TRANSCRIBE'

export type MaterialAiJobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

export interface MaterialAiJob {
  id: number
  type: MaterialAiJobType
  subjectId: number
  sourceMaterialId: number | null
  status: MaterialAiJobStatus
  errorMessage: string | null
  resultMaterialId: number | null
  createdAt: string
  updatedAt: string
}

// Parte metadata del multipart de POST /materials/ai/generate (+ N imágenes)
export interface GenerateAiMaterialRequest {
  subjectId: number
  folderId?: number | null
  exerciseCount?: number
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

/**
 * Icono del material (el componente de lucide, no JSX: este fichero es .ts).
 *
 * Eran emoji, la única iconografía del codebase fuera de lucide: cambiaban de
 * aspecto según el sistema operativo y no heredaban color ni tamaño óptico.
 */
export function getFileIcon(extension: string): LucideIcon {
  const category = getFileCategory(extension)
  switch (category) {
    case 'DOCUMENT':
      return FileText
    case 'SPREADSHEET':
      return FileSpreadsheet
    case 'PRESENTATION':
      return Presentation
    case 'IMAGE':
      return FileImage
    case 'VIDEO':
      return FileVideo
    case 'AUDIO':
      return FileAudio
    case 'CODE':
      return FileCode
    case 'ARCHIVE':
      return FileArchive
    default:
      return File
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

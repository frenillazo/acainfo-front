// Material entity with enriched data from backend
export interface Material {
  id: number
  subjectId: number
  uploadedById: number
  name: string
  description: string | null
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
    if (extensions.includes(ext as any)) {
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
